const { MessageEmbed } = require('discord.js')
const fs = require('fs');

exports.run = async (client, message, args, db) => {
    let prefix, logChannel, logsEnabled;

    await db.collection('guild_settings').doc(message.guild.id).get().then(async (q) => {
        if (q.exists) {
            prefix = q.data().prefix;
            logChannelM = message.guild.channels.cache.find(channel => channel.name === q.data().member_log_channel);
            logChannel = message.guild.channels.cache.find(channel => channel.name === q.data().log_channel);
            logsEnabled = q.data().logs_enabled;

            if (q.data().prune === true) message.delete();

            if(args.length === 0 || args.length > 1) return message.reply(`The current member log channel is ${logChannelM}`);

            await db.collection('guild_settings').doc(message.guild.id).update({
                'member_log_channel': args[0]
            });
            const logChannelClick = message.guild.channels.cache.find(ch => ch.name === q.data().member_log_channel);

            if (logsEnabled === true) {
                const logEmbed = new MessageEmbed()
                    .setAuthor('Chat Update', client.user.displayAvatarURL())
                    .setColor('#ff5400')
                    .setDescription(`${message.member.user.tag} (${message.member}) | Updated the log channel to: ${logChannelClick}`);

                logChannel.send(logEmbed);
            }
        }
    });
}

exports.conf = {
    aliases: []
}