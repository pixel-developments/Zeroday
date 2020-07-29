const { MessageEmbed } = require('discord.js')
const fs = require('fs');

exports.run = async (client, message, args, db) => {
    let prefix, logChannel, logsEnabled, banned_words;

    await db.collection('guild_settings').doc(message.guild.id).get().then(async (q) => {
        if(q.exists) {
            prefix = q.data().prefix;
            logChannel = message.guild.channels.cache.find(channel => channel.name === q.data().log_channel);
            logsEnabled = q.data().logs_enabled;
            banned_words = q.data().banned_words;

            if (q.data().prune === true) message.delete();
        }
    });

    await db.collection('guilds').doc(message.guild.id).get().then(async (q) => {
        if(q.exists) {
            let dbOwner = q.data().guildOwnerID;

            if (message.member.user.id !== dbOwner) return;
            if(args.length == 0 || args.length > 1) return message.reply(`Invalid Arguments! | ${prefix}addbannedword [word]`)

            let word = args[0];

            if(!banned_words.includes(word)) return message.reply('That word is not banned!')

            for(var i = banned_words.length; i >= 0; i--) {
                if(banned_words[i] === word) {
                    banned_words.splice(i, 1);
                }
            }

            await db.collection('guild_settings').doc(message.guild.id).update({
                'banned_words': banned_words
            });

            const logEmbed = new MessageEmbed()
                    .setAuthor('Banned Word List Update', client.user.displayAvatarURL())
                    .setColor('#58cca9')
                    .setDescription(`${message.member.user.tag} (${message.member}) | Removed a Banned Word: **${word}**`);

            if(logsEnabled === true) {
                logChannel.send(logEmbed);
            }
        }
    });
}

exports.conf = {
    aliases: ['banwordremove', 'wordremove', 'removeword', 'deleteword', 'worddelete']
}