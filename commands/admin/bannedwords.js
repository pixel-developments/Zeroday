const { MessageEmbed } = require('discord.js')
const functions = require('../../functions');

exports.run = async (client, message, args, db) => {
    let prefix, logChannel, logsEnabled, banned_words;

    await db.collection('guild_settings').doc(message.guild.id).get().then(async (q) => {
        if (q.exists) {
            prefix = q.data().prefix;
            logChannel = message.guild.channels.cache.find(channel => channel.name === q.data().log_channel);
            logsEnabled = q.data().logs_enabled;
            banned_words = q.data().banned_words;

            if (q.data().prune === true) message.delete();
        }
    }).catch(err => functions.errorMessage(message.channel, err));

    await db.collection('guilds').doc(message.guild.id).get().then(async (q) => {
        if (q.exists) {
            let admins = q.data().admins;
            if (!admins.includes(message.member.roles.highest.id)) return message.reply("You don't have permission to use this command!");
            if (!args[0] || !args[1] || args.length > 2) return message.reply(`Invalid Arguments! | ${prefix}bannedwords <add|remove> <word>`)
            let word = args[1];


            if (args[0] === "add") {
                if (banned_words.includes(word)) return message.reply(`The word ${word} is already banned!`);
                banned_words.push(word);
                db.collection('guild_settings').doc(message.guild.id).update({ 'banned_words': banned_words });

                if (logsEnabled && logChannel != undefined) {
                    const logEmbed = new MessageEmbed()
                        .setAuthor('Banned Word List Update', client.user.displayAvatarURL())
                        .setColor('#58cca9')
                        .setDescription(`${message.member.user.tag} (${message.member}) | Added a Banned Word: **${word}**`);

                    logChannel.send(logEmbed);
                }
            }
            if (args[0] === "remove") {
                if (!banned_words.includes(word)) return message.reply(`The word ${word} is not banned!`);
                for (var i = banned_words.length; i >= 0; i--) {
                    if (banned_words[i] === word) {
                        banned_words.splice(i, 1);
                    }
                }
                db.collection('guild_settings').doc(message.guild.id).update({ 'banned_words': banned_words });

                if (logsEnabled && logChannel != undefined) {
                    const logEmbed = new MessageEmbed()
                        .setAuthor('Banned Word List Update', client.user.displayAvatarURL())
                        .setColor('#58cca9')
                        .setDescription(`${message.member.user.tag} (${message.member}) | Removed a banned word: **${word}**`);

                    logChannel.send(logEmbed);
                }
            }
        }
    }).catch(err => functions.errorMessage(message.channel, err));
}

exports.conf = {
    name: "bannedwords",
    description: "Add/Remove words to the ban list",
    usage: "<add|remove> <reason>",
    category: "admin",
    aliases: ['banword']
}