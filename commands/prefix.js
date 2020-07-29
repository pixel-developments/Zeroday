const { MessageEmbed } = require('discord.js')

exports.run = async(client, message, args, db) => {
    let prefix, logChannel, logsEnabled;

    await db.collection('guild_settings').doc(message.guild.id).get().then(async (q) => {
        if (q.exists) {
            prefix = q.data().prefix;
            logChannel = message.guild.channels.cache.find(channel => channel.name === q.data().log_channel);
            logsEnabled = q.data().logs_enabled;

            if (q.data().prune === true) message.delete();
        }
    });

    await db.collection('guilds').doc(message.guild.id).get().then(async (q) => {
        if (q.exists) {
            let dbOwner = q.data().guildOwnerID;

            if (message.member.user.id !== dbOwner) return;
            if (args.length === 0 || args.length > 1) return message.reply(`The current prefix is: **${prefix}**`);
            let newPrefix = args[0];
            await db.collection('guild_settings').doc(message.guild.id).update({
                'prefix': newPrefix
            }).then(() => message.channel.send(`Prefix changed to **${newPrefix}**`));

            if(logsEnabled === true) {
                const logEmbed = new MessageEmbed()
                    .setAuthor('Prefix Update', client.user.displayAvatarURL())
                    .setColor('#ff5400')
                    .setDescription(`${message.member.user.tag} (${message.member}) | Changed the prefix to **${newPrefix}**`)

                logChannel.send(logEmbed);
            }
        } else {
            console.error('There is no server :(')
        }
    })
}

exports.conf = {
    aliases: []
}