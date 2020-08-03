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
    }).catch(err => {
        const errEmbed = new MessageEmbed()
            .setAuthor('Error!', 'https://cdn0.iconfinder.com/data/icons/shift-free/32/Error-512.png')
            .setDescription('An error occured while preforming this command!\nPlease visit the [Support server](https://discord.gg/6pjvxpR) to report this!')
            .addField(`Error`, err.name)
            .addField('Description', err.description)
            .setColor('a81d0d')
        message.channel.send(errEmbed);
    });

    await db.collection('guilds').doc(message.guild.id).get().then(async (q) => {
        if (q.exists) {
            let mods = q.data().moderators;
            let admins = q.data().admins;

            if(!mods.includes(message.member.roles.highest.id)) {
                message.reply("You don't have permission to use this command!");
                return;
            }
            
            let reason = args.slice(prefix.length).join(" ");
            if(args.length === 0 || !reason) return message.reply(`Invalid Arguments! | ${prefix}warn [user] [reason]`);

            let toWarn = message.guild.member(message.mentions.users.first()) || message.guild.members.cache.get(args[0]);

            db.collection('guilds').doc(message.guild.id).collection('users').doc(toWarn.id).get().then(async pun => {
                let punishment = pun.data().punishments;
                await db.collection('guilds').doc(message.guild.id).collection('users').doc(toWarn.id).update({
                    'punishments': punishment + 1
                })
            }).catch(err => message.channel.send('There was an error preforming this command! Please try again in a second. (Timeout)'));

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
    name: "warn",
    description: "Warns the specified user",
    usage: "warn [user] [reason]",
    category: "moderation",
    aliases: []
}