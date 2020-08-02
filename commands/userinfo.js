const { MessageEmbed } = require('discord.js')
const fs = require('fs');

exports.run = async (client, message, args, db) => {
    let prefix, logChannel, logsEnabled;

    await db.collection('guild_settings').doc(message.guild.id).get().then(async (q) => {
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

    if(args.length === 0) {
        let embed = new MessageEmbed()
            .setColor(message.member.displayHexColor)
            .setAuthor(`${message.member.user.username}'s Information`, client.user.displayAvatarURL())
            .setThumbnail(message.member.user.displayAvatarURL())
            .addField('Username', message.member.user.username, true)
            .addField('ID', message.member.user.id, true)
            .addField('Bot', message.member.user.bot, true)
            .addField('Created At', message.member.user.createdAt, true)
            .addField('Joined At', message.member.user.joinedAt, true)

        message.channel.send(embed);
    }
    if(args.length === 1) {
        let tagged = message.guild.member(message.mentions.users.first()) || message.guild.members.cache.get(args[0]);
        let embed = new MessageEmbed()
            .setColor(tagged.user.displayHexColor)
            .setAuthor(`${tagged.user.username}'s Information`, client.user.displayAvatarURL())
            .setThumbnail(tagged.user.displayAvatarURL())
            .addField('Username', tagged.user.username, true)
            .addField('ID', tagged.user.id, true)
            .addField('Bot', tagged.user.bot, true)
            .addField('Created At', tagged.user.createdAt, true)
            addField('Joined At', tagged.user.joinedAt, true)

        message.channel.send(embed);
    }
}

exports.conf = {
    aliases: ['user', 'uinfo', 'whois']
}