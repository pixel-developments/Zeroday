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

            if(args.length == 0) return message.reply(`Invalid Arguments! | ${prefix}createrole [name] [color]`)

            let embed = new MessageEmbed()
                .setAuthor('Role Created', client.user.displayAvatarURL())
                .setColor('#32e358')
            
            if(args.length == 1) {
                message.guild.roles.create({
                    data: {
                        name: args[0]
                    }
                })
                embed.setDescription(`The role ${args[0]} has been created!`)
            }
            else if(args.length == 2) {
                message.guild.roles.create({
                    data: {
                        name: args[0],
                        color: args[1]
                    }
                })
                embed.setDescription(`The role ${args[0]} has been created with the color ${args[1]}`)
            }

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
    aliases: ['rolecreate']
}