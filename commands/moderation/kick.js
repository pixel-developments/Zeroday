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
            let admins = q.data().admins;
            if(!mods.includes(message.member.roles.highest.id)) {
                message.reply("You don't have permission to use this command!");
                return;
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

            let inf = await db.collection('guilds').doc(message.guild.id).collection('users').doc(toKick.id).collection('infractions').get();
            await db.collection('guilds').doc(message.guild.id).collection('users').doc(toKick.id).collection('infractions').doc(`${inf.size + 1}`).set({
                'moderator': message.author.id,
                'reason': reason,
                'type': 'kick',
                number: inf.size + 1
            });

            let embed = new MessageEmbed()
                .setAuthor('Kick', client.user.displayAvatarURL())
                .setColor('#d65522')
                .setDescription(`${toKick} has been kicked for ${reason}`);

            let user = new MessageEmbed()
                .setAuthor(`Kicked | ${message.guild.name}`, client.user.displayAvatarURL())
                .setColor('#d65522')
                .setDescription(`You have been kicked for **${reason}** on **${message.guild.name}**.`)

            message.channel.send(embed);
            toKick.user.send(user);
            toKick.kick(reason);
            if (logsEnabled && logChannel != undefined) {
                let log = new MessageEmbed()
                    .setAuthor('Mod Log | Ban', client.user.displayAvatarURL())
                    .setColor('#b50c00')
                    .addField('Banned', toBan)
                    .addField('Reason', reason)
                    .addField('Staff', message.member);
                logChannel.send(log);
            }
        }
    }).catch(err => functions.errorMessage(message.channel, err));
}

exports.conf = {
    name: "kick",
    description: "Kicks the specified user from the guild",
    usage: "kick [user] [reason]",
    category: "moderation",
    aliases: []
}