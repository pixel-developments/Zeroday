const { MessageEmbed } = require('discord.js')
const fs = require('fs');
const { auth } = require('firebase-admin');

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

    const player = client.music.players.get(message.guild.id);
    if(!player || !player.queue[0]) return message.reply('There are no songs in the queue.')

    const { title, author, duration, url, thumbnail } = player.queue[0];
    const embed = new MessageEmbed()
        .setAuthor(`Currently Playing: `, message.author.displayAvatarURL)
        .setThumbnail(thumbnail)
        .setDescription(`${player.playing ? "▶️" : "⏸️"} **[${title}](${url})** \`${Utils.formatTime(duration, true)}\` by ${author}`)

    return message.channel.send(embed);
}

exports.conf = {
    name: "nowplaying",
    description: "See what is currently playing",
    usage: "",
    category: "music",
    aliases: ['np']
}