const { MessageEmbed } = require('discord.js')
const functions = require('../../functions');

exports.run = async (client, message, args, db) => {
    let prefix, logChannel, logsEnabled;

    await db.collection('guild_settings').doc(message.guild.id).get().then(async (q) => {
        if (q.exists) {
            prefix = q.data().prefix;
            logChannel = message.guild.channels.cache.find(channel => channel.name === q.data().log_channel);
            logsEnabled = q.data().logs_enabled;

            if (q.data().prune === true) message.delete();

            if (args.length === 0 || args.length > 1) return message.reply(`The join/leave channel is ${logChannelM}`);

            await db.collection('guild_settings').doc(message.guild.id).update({
                'join_leave_channel': args[0]
            });
            const join_leave_channel = message.guild.channels.cache.find(ch => ch.name === q.data().join_leave_channel);

            if (logsEnabled === true) {
                const logEmbed = new MessageEmbed()
                    .setAuthor('Chat Update', client.user.displayAvatarURL())
                    .setColor('#ff5400')
                    .setDescription(`${message.member.user.tag} (${message.member}) | Updated the join/leave channel to: ${join_leave_channel}`);

                logChannel.send(logEmbed);
            }
        }
    }).catch(err => functions.errorMessage(message.channel, err));
}

exports.conf = {
    name: "setjoinleave",
    description: "Set where the join/leave messages will ogo",
    usage: "<channel name>",
    category: "owner",
    aliases: []
}