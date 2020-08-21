const { MessageEmbed } = require('discord.js')
const { Utils } = require('erela.js');
const functions = require('../../functions')

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

    const player = client.music.players.get(message.guild.id);
    if (!player || !player.queue[0]) return message.reply('There are no songs in the queue.')

    const { title, author, duration, url, thumbnail } = player.queue[0];
    const embed = new MessageEmbed()
        .setAuthor(`Currently Playing: `, message.author.displayAvatarURL)
        .setThumbnail(thumbnail)
        .setDescription(`${player.playing ? "▶️" : "⏸️"} **[${title}](${url})** \`${Utils.formatTime(duration, true)}\` by ${author}`)
        .setColor('#589bc4');

    return message.channel.send(embed);
}

exports.conf = {
    name: "nowplaying",
    description: "See what is currently playing",
    usage: "",
    category: "music",
    aliases: ['np']
}