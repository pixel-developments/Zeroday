const { MessageEmbed } = require('discord.js')

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
            .setColor('a81d0d');
        message.channel.send(errEmbed);
    });

    const { channel } = message.member.voice;
    const player = client.music.players.get(message.guild.id);
    
    if(!channel || channel.id !== player.voiceChannel.id) return message.reply('You need to be in a voice channel to use this command!');
    if(!player) return message.reply('There are no songs in the queue.');

    player.pause(player.playing);
    return message.channel.send(`Music is now **${player.playing ? "resumed" : "paused"}**.`)
}

exports.conf = {
    name: "pause",
    description: "Pause/Resume the music",
    usage: "",
    category: "music",
    aliases: ['resume']
}