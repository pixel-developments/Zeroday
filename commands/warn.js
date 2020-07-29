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
    });

    await db.collection('guilds').doc(message.guild.id).get().then(async (q) => {
        if (q.exists) {
            let mods = q.data().moderators;
            let admins = q.data().admins;
            if (!mods.includes(message.member.roles.highest.id) 
                || !admins.includes(message.member.roles.highest.id)) return message.reply("You don't have permission to use this command!");
            
            let reason = args.slice(prefix.length).join(" ");
            if(args.length === 0 || !reason) return message.reply(`Invalid Arguments! | ${prefix}warn [user] [reason]`);

            let toWarn = message.guild.member(message.mentions.users.first()) || message.guild.members.cache.get(args[0]);

            db.collection('guilds').doc(message.guild.id).collection('users').doc(toWarn.id).get().then(async pun => {
                let punishment = pun.data().punishments;
                await db.collection('guilds').doc(message.guild.id).collection('users').doc(toWarn.id).update({
                    'punishments': punishment + 1
                })
            });

            let embed = new MessageEmbed()
                .setAuthor('Warning', client.user.displayAvatarURL())
                .setColor('#ffae00')
                .setDescription(`${toWarn} has been warned for ${reason}`);

            let log = new MessageEmbed()
                .setAuthor('Mod Log | Warning', client.user.displayAvatarURL())
                .setColor('#ffae00')
                .addField('Warn', toWarn)
                .addField('Reason', reason)
                .addField('Staff', message.member);

            let user = new MessageEmbed()
                .setAuthor(`Warning | ${message.guild.name}`, client.user.displayAvatarURL())
                .setColor('#ffae00')
                .setDescription(`You have been warned for **${reason}** on **${message.guild}** server in ${message.channel.name}.`)

            message.channel.send(embed);
            toWarn.user.send(user);
            if(logsEnabled === true) {
                logChannel.send(log);
            }
        }
    });
}

exports.conf = {
    aliases: []
}