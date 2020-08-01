const { MessageEmbed } = require('discord.js')
const fs = require('fs');
const ms = require('ms');

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
            if(!mods.includes(message.member.roles.highest.id)) {
                message.reply("You don't have permission to use this command!");
                return;
            }

            let reason = args.slice(prefix.length + 1).join(" ");
            if (args.length === 0 || !reason) return message.reply(`Invalid Arguments! | ${prefix}tempban [user] [time] [reason]`);

            let toBan = message.guild.member(message.mentions.users.first()) || message.guild.members.cache.get(args[0]);

            await db.collection('guilds').doc(message.guild.id).collection('users').doc(toBan.id).get().then(async pun => {
                let punishment = pun.data().punishments;
                await db.collection('guilds').doc(message.guild.id).collection('users').doc(toBan.id).update({
                    'punishments': punishment + 1
                })
            }).catch(err => message.channel.send('There was an error preforming this command! Please try again in a second. (Timeout)'));
            setTimeout(async function() {
                message.guild.members.unban(toBan.id);
            }, ms[args[1]]);

            let embed = new MessageEmbed()
                .setAuthor('Tempban', client.user.displayAvatarURL())
                .setColor('#b50c00')
                .setDescription(`${toBan} has been banned for ${reason}. Time remaining ${args[1]}`);

            let log = new MessageEmbed()
                .setAuthor('Mod Log | Tempban', client.user.displayAvatarURL())
                .setColor('#b50c00')
                .addField('Banned', toBan)
                .addField('Reason', reason)
                .addField('Staff', message.member);

            let user = new MessageEmbed()
                .setAuthor(`Tempban | ${message.guild.name}`, client.user.displayAvatarURL())
                .setColor('#b50c00')
                .setDescription(`You have been banned for **${reason}** on **${message.guild.name}**. Time remaining: **${args[1]}**.`)

            message.channel.send(embed);
            toBan.user.send(user);
            if(logsEnabled === true) {
                logChannel.send(log);
            }
            toBan.ban(reason);
        }
    }).catch(err => message.channel.send('There was an error preforming this command! Please try again in a second. (Timeout)'));
}

exports.conf = {
    aliases: []
}