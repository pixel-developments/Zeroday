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
            let mods = q.data().moderators;

            if (message.member.user.id !== dbOwner) return;
            if (!args[0] || !args[1] || args.length > 2) return message.reply(`Invalid Arguments! | ${prefix}moderator <add|remove> <role id>`)
            let modID = args[1];

            if (args[0] === "add") {
                if (mods.includes(modID)) return message.reply('That role is already a moderator!');

                mods.push(modID);
                await db.collection('guilds').doc(message.guild.id).update({
                    'moderators': mods
                });

                let adminRole = message.guild.roles.cache.find(mod => mod.id === modID);
                if (logsEnabled && logChannel != undefined) {
                    const logEmbed = new MessageEmbed()
                        .setColor('#3765b0')
                        .setAuthor('System', client.user.displayAvatarURL())
                        .setDescription(`${message.member.user.tag} (${message.member}) | Added a Moderator Role: ${adminRole}`);

                    logChannel.send(logEmbed);
                }
            } else if (args[0] === "remove") {
                if (!mods.includes(modID)) return message.reply('That ID is not a moderator!');

                for (var i = mods.length; i >= 0; i--) {
                    if (mods[i] === modID) {
                        mods.splice(i, 1);
                    }
                }

                await db.collection('guilds').doc(message.guild.id).update({
                    'moderators': mods
                });

                let adminRole = message.guild.roles.cache.find(mod => mod.id === modID);
                if (logsEnabled && logChannel != undefined) {
                    const logEmbed = new MessageEmbed()
                        .setColor('#3765b0')
                        .setAuthor('System', client.user.displayAvatarURL())
                        .setDescription(`${message.member.user.tag} (${message.member}) | Removed a Moderator Role: ${adminRole}`);

                    logChannel.send(logEmbed);
                }
            } else return message.reply(`Invalid Arguments! | ${prefix}moderator <add|remove> <role id>`);
        }
    }).catch(err => functions.errorMessage(message.channel, err));
}

exports.conf = {
    name: "moderator",
    description: "Add/Remove a role to the Moderator group",
    usage: "<add|remove> <role id>",
    category: "owner",
    aliases: ['mod']
}