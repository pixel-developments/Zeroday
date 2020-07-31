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
            let admins = q.data().admins;
            for(let role of message.member.roles) {
                if(!admins.includes(role.id)) {
                    message.reply("You don't have permission to use this command!");
                    break;
                }
            }
            if(!message.guild.me.hasPermission("MANAGE_ROLES")) return message.reply("I don't have permission to use this command!");

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
    }).catch(err => message.channel.send('There was an error preforming this command! Please try again in a second. (Timeout)'));
}

exports.conf = {
    aliases: ['rolecreate']
}