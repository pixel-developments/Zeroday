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
            .setColor('a81d0d')
        message.channel.send(errEmbed);
    });
    db.collection('guilds').doc(message.guild.id).get().then(async (q) => {
        if(q.exists && q.data().premium === false) return message.reply('You need the premium version of ZeroDay to use this command!')
    });

    const player = client.music.players.get(message.guild.id);
    if(!player) return message.reply('There are no songs in the queue.');
    if(args[0]) return message.reply(`Current Volume: **${player.volume}**`);
    if(isNaN(args[0])) return message.reply('You must input a number!');
    if(Number(args[0]) <= 0 || Number(args[0]) > 100) return message.reply('You may only set the volume to 1 - 100');

    player.setVolume(Number(args[0]));
    return message.reply(`Successfully set the volume to **${args[0]}**`);

}

exports.conf = {
    name: "volume",
    description: "Set the volume of the music",
    usage: "",
    category: "premium",
    aliases: ['vol']
}