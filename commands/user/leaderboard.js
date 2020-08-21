const { MessageEmbed } = require('discord.js')
const functions = require('../../functions')

exports.run = async (client, message, args, db) => {
    let prefix, logChannel, logsEnabled;

    await db.collection('guild_settings').doc(message.guild.id).get().then(async (q) => {
        if(q.exists) {
            prefix = q.data().prefix;
            logChannel = message.guild.channels.cache.find(channel => channel.name === q.data().log_channel);
            logsEnabled = q.data().logs_enabled;

            if (q.data().prune === true) message.delete();
        }
    }).catch(err => functions.errorMessage(message.channel, err));

    let users = await db.collection('guilds').doc(message.guild.id).collection('users').get();
    let user_id = users.docs.map(doc => doc.data());

    let lvl_map = new Map();
    let lvl_array = [];
    let page;
    let index = 1;
    let id;
    let level;

    for(let doc of user_id) {
        id = doc.id;
        level = doc.level;
        let xp = doc.xp;

        lvl_map.set(id, level);
        lvl_array = [...lvl_map.entries()].sort((a, b) => b[1] - a[1]);

        page = pages(lvl_array, 10, args[0] || 1);
        if(!page) return message.reply("This server does not have a leaderboard yet!");

    }

    let embed = new MessageEmbed()
        .setAuthor(`${message.guild.name} Level Leaderboard`, message.guild.iconURL)
        .setDescription(page.map(e => `\`#${index++}.\` **|** ${message.guild.members.cache.get(e[0])} \`Lvl ${e[1]}\``))
        .setColor('#6acf42');

    await message.channel.send(embed);
}

exports.conf = {
    name: "leaderboard",
    description: "What users are in the lead for XP?",
    usage: "",
    category: "user",
    aliases: []
}

function pages(arr, itemsPerPage, page = 1) {
    const maxPages = Math.ceil(arr.length / itemsPerPage);
    if(page < 1 || page > maxPages) return null;
    return arr.slice((page - 1) * itemsPerPage, page * itemsPerPage);
}