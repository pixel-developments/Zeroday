const { Utils } = require('erela.js');
const { MessageEmbed } = require('discord.js');

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

    const { channel } = message.member.voice;
    if (!channel) return message.reply('You need to be in a voice channel to play music!');

    const permissions = channel.permissionsFor(message.client.user);
    if(!permissions.has('CONNECT')) return message.reply('I cannot connect to your voice channel! Make sure I have permission to.');
    if(!permissions.has('SPEAK')) return message.reply('I cannot speak in your voice channel! Make sure I have permission to.');

    if(!args[0]) return message.reply(`Invalid Arguments! | ${prefix}play [song]`);

    const player = client.music.players.spawn({
        guild: message.guild,
        textChannel: message.channel,
        voiceChannel: channel
    });

    client.music.search(args.join(" "), message.author).then(async res => {
        switch(res.loadType) {
            case "TRACK_LOADED":
                player.queue.add(res.tracks[0]);
                message.channel.send(`Enqueueing \`${res.tracks[0].title}\`${Utils.formatTime(res.tracks[0].duration, true)}`);
                if(!player.playing) player.play();
                break;
            case "SEARCH_RESULT":
                let index = 1;
                const tracks = res.tracks.slice(0, 5);
                const embed = new MessageEmbed()
                    .setAuthor('Song Selection', message.author.displayAvatarURL())
                    .setDescription(tracks.map(video => `**${index++} -** ${video.title} `))
                    .setFooter("Your response time closes within the next 30 seconds. Type  'cancel' to cancel the selection")
                    .setColor('#589bc4');
                await message.channel.send(embed);

                const collector = message.channel.createMessageCollector(m => {
                    return m.author.id === message.author.id && new RegExp(`^([1-5]|cancel)$`, "i").test(m.content)
                }, {time: 30000, max: 1});

                collector.on("collect", m => {
                    if(/cancel/i.test(m.content)) return collector.stop("cancelled");

                    const track = tracks[Number(m.content) - 1];
                    player.queue.add(track);
                    message.channel.send(`Enqueueing \`${track.title}\`${Utils.formatTime(track.duration, true)}`);
                    if(!player) player.play();
                });

                collector.on("end", (_, reason) => {
                    if(["time", "cancelled"].includes(reason)) return message.channel.send("Cancelled selection.")
                });
                break;
            case "PLAYLIST_LOADED":
                res.playlist.tracks.forEach(track => player.queue.add(track));
                const duration = Utils.formatTime(res.playlist.tracks.reduce((acc, cur) => ({duration: acc.duration + cur.duration})).duration, true);
                message.channel.send(`Enqueueing \`${res.playlist.tracks.length}\`${duration}\` tracks in playlist \`${res.playlist.info.name}\``);
                if(!player.playing) player.play();
                break;
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
    name: "play",
    description: "Play those tunes",
    usage: "[song]",
    category: "music",
    aliases: []
}