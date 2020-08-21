const { MessageEmbed } = require('discord.js')

exports.run = async (client, message, args, db) => {
    try {
        let hex = Math.random().toString(16).slice(2, 8).toUpperCase().slice(-6);

        let embed = new MessageEmbed()
            .setAuthor(`#${hex}`, client.user.displayAvatarURL())
            .setColor(hex)
            .setDescription(`Random HEX Code: #${hex}`)

        message.channel.send(embed);
    } catch(err) {
        message.channel.send('There was an error!\n' + err).catch();
    }
}

exports.conf = {
    name: "randomcolor",
    description: "Get all the colors!",
    usage: "randomcolor",
    category: "user",
    aliases: []
}