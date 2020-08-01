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
            let admins = q.data().admins;

            if (message.member.user.id !== dbOwner) return;
            if(args.length == 0 || args.length > 1) return message.reply(`Invalid Arguments! | ${prefix}deleteadmin [role id]`)

            let adminID = args[0];

            if(!admins.includes(adminID)) return message.reply('That ID is not an admin!')

            for(var i = admins.length; i >= 0; i--) {
                if(admins[i] === adminID) {
                    admins.splice(i, 1);
                }
            }

            await db.collection('guilds').doc(message.guild.id).update({
                'admins': admins
            });

            let adminRole = message.guild.roles.cache.find(moderatorRole => moderatorRole.id === adminID);

            const logEmbed = new MessageEmbed()
                    .setAuthor('Admin Role Update', client.user.displayAvatarURL())
                    .setColor('#58cca9')
                    .setDescription(`${message.member.user.tag} (${message.member}) | Removed an Admin Role: ${adminRole}`);

            if(logsEnabled === true) {
                logChannel.send(logEmbed);
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
    aliases: ['admindelete', 'deladmin', 'deleteadmin']
}