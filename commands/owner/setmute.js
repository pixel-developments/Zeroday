const { MessageEmbed } = require('discord.js')
const fs = require('fs');

exports.run = async (client, message, args, db) => {
    let prefix, logChannel, logsEnabled;

    await db.collection('guild_settings').doc(message.guild.id).get().then(async (q) => {
        if (q.exists) {
            prefix = q.data().prefix;
            logChannel = message.guild.channels.cache.find(channel => channel.name === q.data().log_channel);
            logsEnabled = q.data().logs_enabled;

            if (q.data().prune === true) message.delete();

            if (args.length === 0 || args.length > 1) return message.reply(`The current log channel is ${logChannel}`);

            await db.collection('guild_settings').doc(message.guild.id).update({
                'mute_role': args[0]
            });

            const mutedRole = message.guild.roles.cache.find(muteRole => muteRole.id === q.data().mute_role);
            if (logsEnabled === true) {
                const logEmbed = new MessageEmbed()
                    .setAuthor('Role Update', client.user.displayAvatarURL())
                    .setColor('#ff5400')
                    .setDescription(`${message.member.user.tag} (${message.member}) | Updated the mute role to: ${mutedRole}`);

                logChannel.send(logEmbed);
            }
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
    name: "setmute",
    description: "Set the muted role",
    usage: "setmute [role id]",
    category: "owner",
    aliases: []
}