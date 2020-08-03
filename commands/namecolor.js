const { MessageEmbed } = require('discord.js')
const fs = require('fs');
const ntc = require('name-that-color');

exports.run = async (client, message, args, db) => {
    let prefix, logChannel, logsEnabled;

    db.collection('guild_settings').doc(message.guild.id).get().then(async (q) => {
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

    if(args.length === 0) return message.reply(`Invalid Arguments! | ${prefix}namethatcolor [hex value]`)
    let color = args[0];
    let result = ntc.name(color);

    let embed = new MessageEmbed()
        .setAuthor(`Color | ${color}`)
        .setColor(result[0])
        .setDescription(`**Color Name:** ${result[1]}`)

    message.channel.send(embed);
}

exports.conf = {
    aliases: ['nc']
}