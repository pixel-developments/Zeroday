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

    let xp_array = [];
    let xp;
    let user;
    let index = 1;
    for (let doc of user_id) {
        xp_array.push(doc.xp);
        xp = xp_array.sort((a, b) => b - a);
        user = message.guild.members.cache.get(doc.id);
    }
    console.log(xp);
    let msg = xp.splice(1, 10).map(x => `**${index++}.** ${user} - \`${xp}\``).join("\n");
    message.channel.send(msg);
}

exports.conf = {
    name: "leaderboard",
    description: "What users are in the lead for XP?",
    usage: "",
    category: "user",
    aliases: []
}