const { MessageEmbed } = require('discord.js')
const functions = require('../../functions');

exports.run = async (client, message, args, db) => {
    let prefix, logChannel, logsEnabled;

    await db.collection('guild_settings').doc(message.guild.id).get().then(async (q) => {
        if (q.exists) {
            prefix = q.data().prefix;
            logChannel = message.guild.channels.cache.find(channel => channel.name === q.data().log_channel);
            logsEnabled = q.data().logs_enabled;

            if (q.data().prune === true) message.delete();
        }
    }).catch(err => functions.errorMessage(message.channel, err));

    await db.collection('guilds').doc(message.guild.id).get().then(async (q) => {
        if (q.exists) {
            let dbOwner = q.data().guildOwnerID;
            let admins = q.data().admins;

            if (message.member.user.id !== dbOwner) return;
            if (!args[0] || !args[1] || args.length > 2) return message.reply(`Invalid Arguments! | ${prefix}admin <add|remove> <role id>`)
            let adminID = args[1];

            if(args[0] === "add") {
                if (admins.includes(adminID)) return message.reply('That role is already an admin!');

                admins.push(adminID);
                await db.collection('guilds').doc(message.guild.id).update({
                    'admins': admins
                });

                let adminRole = message.guild.roles.cache.find(admin => admin.id === adminID);
                if (logsEnabled && logChannel != undefined) {
                    const logEmbed = new MessageEmbed()
                        .setColor('#3765b0')
                        .setAuthor('System', client.user.displayAvatarURL())
                        .setDescription(`${message.member.user.tag} (${message.member}) | Added an Admin Role: ${adminRole}`);

                    logChannel.send(logEmbed);
                }
            } else if(args[0] === "remove") {
                if (!admins.includes(adminID)) return message.reply('That ID is not an admin!');

                for (var i = admins.length; i >= 0; i--) {
                    if (admins[i] === adminID) {
                        admins.splice(i, 1);
                    }
                }

                await db.collection('guilds').doc(message.guild.id).update({
                    'admins': admins
                });

                let adminRole = message.guild.roles.cache.find(admin => admin.id === adminID);
                if (logsEnabled && logChannel != undefined) {
                    const logEmbed = new MessageEmbed()
                        .setColor('#3765b0')
                        .setAuthor('System', client.user.displayAvatarURL())
                        .setDescription(`${message.member.user.tag} (${message.member}) | Added an Admin Role: ${adminRole}`);

                    logChannel.send(logEmbed);
                }
            } else return message.reply(`Invalid Arguments! | ${prefix}admin <add|remove> <role id>`);
        }
    }).catch(err => functions.errorMessage(message.channel, err));
}

exports.conf = {
    name: "admin",
    description: "Add/Remove a role to the Admin group",
    usage: "<add|remove> <role id>",
    category: "owner",
    aliases: []
}