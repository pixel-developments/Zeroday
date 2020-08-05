const { MessageEmbed } = require('discord.js')
const fs = require('fs');

exports.run = async (client, message, args, db) => {
    let prefix, logChannel, logsEnabled;

    db.collection('guild_settings').doc(message.guild.id).get().then(async (q) => {
        if(q.exists) {
            prefix = q.data().prefix;
            logChannel = message.guild.channels.cache.find(channel => channel.name === q.data().log_channel);
            logsEnabled = q.data().logs_enabled;

            if (q.data().prune === true) message.delete();
        }
    }).catch(err => {
        const errEmbed = new MessageEmbed()
            .setAuthor('Error!', 'https://cdn0.iconfinder.com/data/icons/shift-free/32/Error-512.png')
            .setDescription('An error occured while preforming this command!\nPlease visit the [Support server](https://discord.gg/6pjvxpR) to report this!')
            .addField(`Error`, err.name)
            .addField('Description', err.description)
            .setColor('a81d0d')
        message.channel.send(errEmbed);
    });

    let users = await db.collection('guilds').doc(message.guild.id).collection('users').get();
    let user_id = users.docs.map(doc => doc.data());

    let lvl_map = new Map();
    let string = "";
    let index = 1;

    for (let doc of user_id) {
        lvl_map.set(doc.id, doc.level);
        let lvl = new Map([...lvl_map.entries()].sort((a, b) => b[1] - a[1]));
        console.log(lvl);

        let user = message.guild.members.cache.get(doc.id);
        
        string += `**${index++}.** ${user} | ${lvl.get(doc.id)}\n`;
    }

    let embed = new MessageEmbed()
        .setAuthor(`${message.guild.name} Level Leaderboard`, message.guild.iconURL)
        .setDescription(string)
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