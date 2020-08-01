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
            .setDescription('An error occured while preforming this command!')
            .addField(`Error`, err.name)
            .addField('Description', err.description)
            .setFooter('Please report this back to Zuke on the [ZeroDay Support Server](https://discord.gg/6pjvxpR)')
        message.channel.send(errEmbed);
    });

    await db.collection('guilds').doc(message.guild.id).get().then(async (q) => {
        if(q.exists) {
            let dbOwner = q.data().guildOwnerID;
            let admins = q.data().admins;

            if (message.member.user.id !== dbOwner) return;
            if(args.length == 0 || args.length > 1) return message.reply(`Invalid Arguments! | ${prefix}addadmin [role id]`)

            let adminID = args[0];

            if(admins.includes(adminID)) return message.reply('That role is already an admin!')


            admins.push(adminID);
            await db.collection('guilds').doc(message.guild.id).update({
                'admins': admins
            });

            let adminRole = message.guild.roles.cache.find(moderatorRole => moderatorRole.id === adminID);

            const logEmbed = new MessageEmbed()
                    .setAuthor('Admin Role Update', client.user.displayAvatarURL())
                    .setColor('#58cca9')
                    .setDescription(`${message.member.user.tag} (${message.member}) | Added a Admin Role: ${adminRole}`);

            if(logsEnabled === true) {
                logChannel.send(logEmbed);
            }
        }
    }).catch(err => {
        const errEmbed = new MessageEmbed()
            .setAuthor('Error!', 'https://cdn0.iconfinder.com/data/icons/shift-free/32/Error-512.png')
            .setDescription('An error occured while preforming this command!')
            .addField(`Error`, err.name)
            .addField('Description', err.description)
            .setFooter('Please report this back to Zuke on the [ZeroDay Support Server](https://discord.gg/6pjvxpR)')
        message.channel.send(errEmbed);
    });
}

exports.conf = {
    aliases: ['adminadd']
}