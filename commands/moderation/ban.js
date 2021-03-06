const { MessageEmbed } = require('discord.js')
const functions = require('../../functions');

exports.run = async (client, message, args, db) => {
    let prefix, logChannel, logsEnabled;

    await db.collection('guild_settings').doc(message.guild.id).get().then(async (q) => {
        if (q.exists) {
            prefix = q.data().prefix;
            logChannel = message.guild.channels.cache.find(channel => channel.name === q.data().member_log_channel);
            logsEnabled = q.data().logs_enabled;

            if (q.data().prune === true) message.delete();
        }
    }).catch(err => functions.errorMessage(message.channel, err));

    await db.collection('guilds').doc(message.guild.id).get().then(async (q) => {
        if (q.exists) {
            let mods = q.data().moderators;
            if (!mods.includes(message.member.roles.highest.id)) return message.reply("You don't have permission to use this command!");

            let reason = args.slice(prefix.length).join(" ");
            if (args.length === 0 || !reason) return message.reply(`Invalid Arguments! | ${prefix}ban [user] [reason]`);

            let toBan = message.guild.member(message.mentions.users.first()) || message.guild.members.cache.get(args[0]);

            await db.collection('guilds').doc(message.guild.id).collection('users').doc(toBan.id).get().then(async pun => {
                let punishment = pun.data().punishments;
                await db.collection('guilds').doc(message.guild.id).collection('users').doc(toBan.id).update({
                    'punishments': punishment + 1
                })
            }).catch(err => message.channel.send('There was an error preforming this command! Please try again in a second. (Timeout)'));

            let inf = await db.collection('guilds').doc(message.guild.id).collection('users').doc(toBan.id).collection('infractions').get();
            await db.collection('guilds').doc(message.guild.id).collection('users').doc(toBan.id).collection('infractions').doc(`${inf.size + 1}`).set({
                'moderator': message.author.id,
                'reason': reason,
                'type': 'ban',
                number: inf.size + 1
            });

            let embed = new MessageEmbed()
                .setAuthor('Ban', client.user.displayAvatarURL())
                .setColor('#b50c00')
                .setDescription(`${toBan} has been banned for ${reason}`);

            let user = new MessageEmbed()
                .setAuthor(`Ban | ${message.guild.name}`, client.user.displayAvatarURL())
                .setColor('#b50c00')
                .setDescription(`You have been banned for **${reason}** on **${message.guild.name}**.`)

            message.channel.send(embed);
            toBan.user.send(user);
            if (logsEnabled && logChannel != undefined) {
                let log = new MessageEmbed()
                    .setAuthor('Mod Log | Ban', client.user.displayAvatarURL())
                    .setColor('#b50c00')
                    .addField('Banned', toBan)
                    .addField('Reason', reason)
                    .addField('Staff', message.member);
                logChannel.send(log);
            }
            toBan.ban(reason);
        }
    }).catch(err => functions.errorMessage(message.channel, err));
}

exports.conf = {
    name: "ban",
    description: "Ban the specified user from the guild",
    usage: "<user> <reason>",
    category: "moderation",
    aliases: []
}