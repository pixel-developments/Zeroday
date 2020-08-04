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
            let dbOwner = q.data().guildOwnerID;
            let premium = q.data().premium;
            let mods = q.data().moderators;
            let admins = q.data().admins;
            if(!mods.includes(message.member.roles.highest.id)) {
                message.reply("You don't have permission to use this command!");
                return;
            }
        
            if(!args[0]) return message.reply(`Invalid Arguments! | ${prefix}purge [number]`)
            if(isNaN(args[0])) return message.reply(`Invalid Arguments! | ${prefix}purge [number]`);

            message.channel.bulkDelete(args[0]).then(message.channel.send(`Messages Deleted: ${args[0]}`)).catch(err => {
                const errEmbed = new MessageEmbed()
                    .setAuthor('Error!', 'https://cdn0.iconfinder.com/data/icons/shift-free/32/Error-512.png')
                    .setDescription('An error occured while preforming this command!\nPlease visit the [Support server](https://discord.gg/6pjvxpR) to report this!')
                    .addField(`Error`, err.name)
                    .addField('Description', err.message)
                    .setColor('a81d0d')
                message.channel.send(errEmbed);
            });;
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
    name: "purge",
    description: "Purges the chat",
    usage: "purge [amount]",
    category: "moderation",
    aliases: ['delete', 'clear']
}