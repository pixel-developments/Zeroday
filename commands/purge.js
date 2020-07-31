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
    }).catch(err => message.channel.send('There was an error preforming this command! Please try again in a second. (Timeout)'));

    await db.collection('guilds').doc(message.guild.id).get().then(async (q) => {
        if(q.exists) {
            let dbOwner = q.data().guildOwnerID;
            let premium = q.data().premium;
            let mods = q.data().moderators;
            let admins = q.data().admins;
            message.member.roles.forEach(role => {
                if(!mods.includes(role.id) || !admins.includes(role.id)) return message.reply("You don't have permission to use this command!");
            });
        
            if(!args[0]) return message.reply(`Invalid Arguments! | ${prefix}purge [number]`)
            if(isNaN(args[0])) return message.reply(`Invalid Arguments! | ${prefix}purge [number]`);

            message.channel.bulkDelete(args[0]).then(message.channel.send(`Messages Deleted: ${args[0]}`));
        }
    }).catch(err => message.channel.send('There was an error preforming this command! Please try again in a second. (Timeout)'))
}

exports.conf = {
    aliases: ['delete', 'clear']
}