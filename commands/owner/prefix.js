const { MessageEmbed } = require('discord.js')

exports.run = async(client, message, args, db) => {
    let prefix, logChannel, logsEnabled;

    await db.collection('guild_settings').doc(message.guild.id).get().then(async (q) => {
        if (q.exists) {
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
        if (q.exists) {
            let dbOwner = q.data().guildOwnerID;

            if (message.member.user.id !== dbOwner) return;
            if (args.length === 0 || args.length > 1) return message.reply(`The current prefix is: **${prefix}**`);
            let newPrefix = args[0];
            await db.collection('guild_settings').doc(message.guild.id).update({
                'prefix': newPrefix
            }).then(() => message.channel.send(`Prefix changed to **${newPrefix}**`));

            if(logsEnabled === true) {
                const logEmbed = new MessageEmbed()
                    .setAuthor('Prefix Update', client.user.displayAvatarURL())
                    .setColor('#ff5400')
                    .setDescription(`${message.member.user.tag} (${message.member}) | Changed the prefix to **${newPrefix}**`)

                logChannel.send(logEmbed);
            }
        } else {
            console.error('There is no server :(')
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
    name: "prefix",
    description: "View or change the prefix",
    usage: "prefix [prefix]",
    category: "owner",
    aliases: []
}