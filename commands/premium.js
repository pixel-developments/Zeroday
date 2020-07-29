const { MessageEmbed } = require('discord.js')
const fs = require('fs');

let keys = require('../keys.json');

exports.run = async (client, message, args, db) => {
    let prefix, logChannel, logsEnabled;

    await db.collection('guild_settings').doc(message.guild.id).get().then(async (q) => {
        if (q.exists) {
            prefix = q.data().prefix;
            logChannel = message.guild.channels.cache.find(channel => channel.name === q.data().log_channel);
            logsEnabled = q.data().logs_enabled;

            if (q.data().prune === true) message.delete();
        }
    }).catch(err => message.channel.send('There was an error preforming this command! Please try again in a second. (Timeout)'));

    await db.collection('guilds').doc(message.guild.id).get().then(async (q) => {
        if (q.exists) {
            let dbOwner = q.data().guildOwnerID;
            let premium = q.data().premium;

            if(message.member.user.id !== dbOwner) return;
            if (args.length === 0 || args.length > 1) {
                switch(premium) {
                    case false:
                        let premiumNoEmbed = new MessageEmbed()
                            .setAuthor('Premium', client.user.displayAvatarURL())
                            .setColor('#21de99')
                            .setDescription('You do not have premium! To get premium status, please click on the title of this card.')
                            .setURL('https://google.com')
                        message.channel.send(premiumNoEmbed);
                        break;
                    case true:
                        let premiumYesEmbed = new MessageEmbed()
                            .setAuthor('Premium', client.user.displayAvatarURL())
                            .setColor('#21de99')
                            .setDescription('You already have the premium version of me! Thank you for your support.');
                        message.channel.send(premiumYesEmbed);
                        break;
                }
                return;
            }
            if (premium === true) return message.reply('This server is already premium!');
            let userKey = args[0];
            if(!keys[userKey] || keys[userKey].valid === false) return message.reply('That key is not valid!')

            await db.collection('guilds').doc(message.guild.id).update({
                'premium': true
            })
            delete keys[userKey];
            fs.writeFile('./keys.json', JSON.stringify(keys, null, 4), (err) => {
                if(err) console.log(`Error in saving key to file:\n${err}`);
            });

            if(logsEnabled === true) {
                const logEmbed = new MessageEmbed()
                    .setAuthor('Premium Update', client.user.displayAvatarURL())
                    .setColor('#ff5400')
                    .setDescription(`${message.member.user.tag} (${message.member}) has made the bot **premium** in this server!`)

                logChannel.send(logEmbed);
            }
        }
    }).catch(err => message.channel.send('There was an error preforming this command! Please try again in a second. (Timeout)'));
}
exports.conf = {
    aliases: ['validate', 'key']
}