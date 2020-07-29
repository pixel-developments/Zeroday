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
    });

    await db.collection('guilds').doc(message.guild.id).get().then(async (q) => {
        if(q.exists) {
            let admins = q.data().admins;
            if (!admins.includes(message.member.roles.highest.id)) return message.reply("You don't have permission to use this command!");
            if(!message.guild.me.hasPermission("MANAGE_ROLES")) return message.reply("I don't have permission to use this command!");

            if(args.length == 0) return message.reply(`Invalid Arguments! | ${prefix}deleterole [name]`)

            let embed = new MessageEmbed()
                .setAuthor('Role Deleted', client.user.displayAvatarURL())
                .setColor('#32e358')
                .setDescription(`The role ${args[0]} has been removed!`)

            message.guild.roles.cache.find(role => role.name === args[0]).delete();

            if(logsEnabled === true) {
                logChannel.send(embed);
            }
        }
    });
}

exports.conf = {
    aliases: ['roledelete']
}