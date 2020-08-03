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
            let mods = q.data().moderators;

            if (message.member.user.id !== dbOwner) return;
            if(args.length == 0 || args.length > 1) return message.reply(`Invalid Arguments! | ${prefix}deletemod [role id]`)

            let modID = args[0];

            if(!mods.includes(modID)) return message.reply('That ID is not a moderator!')

            for(var i = mods.length; i >= 0; i--) {
                if(mods[i] === modID) {
                    mods.splice(i, 1);
                }
            }

            await db.collection('guilds').doc(message.guild.id).update({
                'moderators': mods
            });

            let modRole = message.guild.roles.cache.find(moderatorRole => moderatorRole.id === modID);

            const logEmbed = new MessageEmbed()
                    .setAuthor('Mod Role Update', client.user.displayAvatarURL())
                    .setColor('#58cca9')
                    .setDescription(`${message.member.user.tag} (${message.member}) | Removed a Moderator Role: ${modRole}`);

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
    name: "removemoderator",
    description: "Removes the specified role from the Moderator group",
    usage: "removemoderator [role id]",
    aliases: ['moddelete', 'delmod', 'deletemod']
}