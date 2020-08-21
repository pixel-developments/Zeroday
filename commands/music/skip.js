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
    if (!player) return message.reply('There are no songs in the queue.');

    player.stop();
    return message.reply('⏭️ Skipped!');
}

exports.conf = {
    name: "skip",
    description: "Skips the current song",
    usage: "",
    category: "music",
    aliases: []
}