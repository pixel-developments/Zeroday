const { MessageEmbed } = require('discord.js')
const fs = require('fs');

exports.run = async (client, message, args, db) => {
    let prefix, logChannel, logsEnabled;

    await db.collection('guild_settings').doc(message.guild.id).get().then(async (q) => {
        if (q.exists) {
            prefix = q.data().prefix;
            logChannel = message.guild.channels.cache.find(channel => channel.name === q.data().member_log_channel);
            logsEnabled = q.data().logs_enabled;

            if (q.data().prune === true) message.delete();
        }
    }).catch(err => message.channel.send('There was an error preforming this command! Please try again in a second. (Timeout)'));

    await db.collection('guilds').doc(message.guild.id).get().then(async (q) => {
        if (q.exists) {
            let mods = q.data().moderators;
            let admins = q.data().admins;
            for(let role of message.member.roles) {
                if(!mods.includes(role.id) || !admins.includes(role.id)) {
                    message.reply("You don't have permission to use this command!");
                    break;
                }
            }
            
            let reason = args.slice(prefix.length).join(" ");
            if (args.length === 0 || !reason) return message.reply(`Invalid Arguments! | ${prefix}kick [user] [reason]`);

            let toKick = message.guild.member(message.mentions.users.first()) || message.guild.members.cache.get(args[0]);

            await db.collection('guilds').doc(message.guild.id).collection('users').doc(toKick.id).get().then(async pun => {
                let punishment = pun.data().punishments;
                await db.collection('guilds').doc(message.guild.id).collection('users').doc(toKick.id).update({
                    'punishments': punishment + 1
                })
            });
            toKick.kick(reason);

            let embed = new MessageEmbed()
                .setAuthor('Kick', client.user.displayAvatarURL())
                .setColor('#d65522')
                .setDescription(`${toKick} has been kicked for ${reason}`);

            let log = new MessageEmbed()
                .setAuthor('Mod Log | Kick', client.user.displayAvatarURL())
                .setColor('#d65522')
                .addField('Kicked', toKick)
                .addField('Reason', reason)
                .addField('Staff', message.member);

            let user = new MessageEmbed()
                .setAuthor(`Kicked | ${message.guild.name}`, client.user.displayAvatarURL())
                .setColor('#d65522')
                .setDescription(`You have been kicked for **${reason}** on **${message.guild.name}**.`)

            message.channel.send(embed);
            toKick.user.send(user);
            if(logsEnabled === true) {
                logChannel.send(log);
            }
        }
    }).catch(err => message.channel.send('There was an error preforming this command! Please try again in a second. (Timeout)'));
}

exports.conf = {
    aliases: []
}