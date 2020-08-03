const { MessageEmbed, Message } = require('discord.js')
const fs = require('fs');

exports.run = async (client, message, args, db) => {
    let prefix, logChannel, logsEnabled;

    await db.collection('guild_settings').doc(message.guild.id).get().then(async (q) => {
        if (q.exists) {
            prefix = q.data().prefix;
            logChannel = message.guild.channels.cache.find(channel => channel.name === q.data().log_channel);
            logsEnabled = q.data().logs_enabled;

            if(q.data().prune === true) message.delete();
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

    await db.collection('guilds').doc(message.guild.id).collection('users').doc(message.member.user.id).get().then(async (q) => {
        if (q.exists) {
            let user = q.data().id;
            let dUser = message.guild.members.cache.get(user);

            let nextLvl = (q.data().level * 450) + (q.data().level * 100);
            console.log(nextLvl);
            let xpToNextLvl = nextLvl - q.data().xp

            let embed = new MessageEmbed()
                .setAuthor(`${dUser.user.username} Level`, client.user.displayAvatarURL())
                .setColor(message.member.displayColor)
                .addField('Level', q.data().level, true)
                .addField('XP', q.data().xp, true)
                .addField('Next Level', xpToNextLvl, true);

            message.channel.send(embed);
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
}

exports.conf = {
    name: "level",
    description: "Check out what level you are on the server",
    usage: "level",
    category: "user",
    aliases: ['lvl', 'rank', 'rnk']
}