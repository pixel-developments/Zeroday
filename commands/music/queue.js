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

    const { channel } = message.member.voice;
    const player = client.music.players.get(message.guild.id);

    if (!channel || channel.id !== player.voiceChannel.id) return message.reply('You need to be in a voice channel to use this command!');
    if (!player || !player.queue[0]) return message.reply('There are no songs in the queue.');

    let index = 1;
    let string = "";

    if (player.queue[0]) string += `__**Currently Playing:**__\n${player.queue[0].title} - **Requested by: **${player.queue[0].requester}**\n`;
    if (player.queue[1]) string += `__**Queue:**__ \n${player.queue.slice(1, 10).map(x => `**${index++}.** ${x.title} - **Requested by: ${x.requester}**`).join("\n")}`;

    const embed = new MessageEmbed()
        .setAuthor(`Current Queue for ${message.guild.name}`, message.guild.iconURL)
        .setThumbnail(player.queue[0].thumbnail)
        .setDescription(string)
        .setColor('a81d0d');

    return message.channel.send(embed);
}

exports.conf = {
    name: "queue",
    description: "Lists the music queue",
    usage: "",
    category: "music",
    aliases: []
}