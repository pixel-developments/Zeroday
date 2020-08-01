const { MessageEmbed } = require('discord.js')
const fs = require('fs');

exports.run = async (client, message, args, db) => {
    let prefix, logChannel, logsEnabled;

    await db.collection('guild_settings').doc(message.guild.id).get().then(async (q) => {
        if(q.exists) {
            prefix = q.data().prefix;
            logChannel = message.guild.channels.cache.find(channel => channel.name === q.data().log_channel);
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
        if(q.exists) {
            let admins = q.data().admins;
            if(!admins.includes(message.member.roles.highest.id)) {
                message.reply("You don't have permission to use this command!");
                return;
            }

            if(args.length < 2) return message.reply(`Invalid Arguments! | ${prefix}addrole [user] [role]`)
            let addToUser = message.guild.member(message.mentions.users.first()) || message.guild.members.cache.get(args[0]);
            const role = message.guild.roles.cache.find(role => role.name === args[1]);

            if(!addToUser.roles.cache.has(role.id)) return message.reply(`${addToUser} does not have the role ${role}!`);

            let embed = new MessageEmbed()
                .setAuthor('Member Edited', client.user.displayAvatarURL())
                .setColor('#b163e6')
                .setDescription(`${addToUser} has been remove from the role ${role}`)

            addToUser.roles.remove(role);

            if(logsEnabled === true) {
                logChannel.send(embed);
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
    aliases: ['roleremove']
}