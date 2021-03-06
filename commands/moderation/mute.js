const { MessageEmbed } = require('discord.js')
const functions = require('../../functions');
const ms = require('ms');

exports.run = async (client, message, args, db) => {
    let prefix, logChannel, logsEnabled, muteRole;

    await db.collection('guild_settings').doc(message.guild.id).get().then(async (q) => {
        if (q.exists) {
            prefix = q.data().prefix;
            logChannel = message.guild.channels.cache.find(channel => channel.name === q.data().member_log_channel);
            logsEnabled = q.data().logs_enabled;
            muteRole = q.data().mute_role;

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
            
            let reason = args.slice(prefix.length + 1).join(" ");

            if(args.length === 0 || !reason) return message.reply(`Invalid Arguments! | ${prefix}mute [user] [time] [reason]`);
            let toMute = message.guild.member(message.mentions.users.first()) || message.guild.members.cache.get(args[0]);
            const mutedRole = message.guild.roles.cache.find(mutedRole => mutedRole.id === muteRole);

            if (!args[1].endsWith("s") && !args[1].endsWith("m") && !args[1].endsWith("h") && !args[1].endsWith("d") && !args[1].endsWith("y")) return message.reply("You did not use the correct time format! (Ex. 1d)")

            await db.collection('guilds').doc(message.guild.id).collection('users').doc(toMute.id).get().then(async pun => {
                let punishment = pun.data().punishments;
                await db.collection('guilds').doc(message.guild.id).collection('users').doc(toMute.id).update({
                    'punishments': punishment + 1
                })
            });

            let inf = await db.collection('guilds').doc(message.guild.id).collection('users').doc(toMute.id).collection('infractions').get();
            await db.collection('guilds').doc(message.guild.id).collection('users').doc(toMute.id).collection('infractions').doc(`${inf.size + 1}`).set({
                'moderator': message.author.id,
                'reason': reason,
                'type': 'mute',
                number: inf.size + 1
            });

            await toMute.roles.add(mutedRole.id)
                .catch(err => {
                    if (err) return message.channel.send("Something horrible has happened. Please contact the developers about it").then(console.log(err))
                });
            setTimeout(async function () {
                await toMute.roles.remove(mutedRole.id);
            }, ms(args[1]));

            let embed = new MessageEmbed()
                .setAuthor('Mute', client.user.displayAvatarURL())
                .setColor('#ff6200')
                .setDescription(`${toMute} has been muted for ${reason} for ${args[1]}`);

            let user = new MessageEmbed()
                .setAuthor(`Mute | ${message.guild.name}`, client.user.displayAvatarURL())
                .setColor('#ff6200')
                .setDescription(`You have been muted for **${reason}** on **${message.guild.name}** server in **${message.channel}**. Time: **${args[1]}**`)

            message.channel.send(embed);
            toMute.user.send(user);
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
    name: "mute",
    description: "Mutes the specified user for the specified time",
    usage: "mute [user] [time] [reason]",
    category: "moderation",
    aliases: []
}