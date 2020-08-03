const {MessageEmbed} = require('discord.js');

exports.run = async (client, message, args, db) => {
    let days = Math.floor(client.uptime / 86400000);
    let hours = Math.floor(client.uptime / 3600000) % 24;
    let minutes = Math.floor(client.uptime / 60000) % 60;
    let seconds = Math.floor(client.uptime / 1000) % 60;

    let embed = new MessageEmbed()
        .setAuthor('Uptime', 'https://images.vexels.com/media/users/3/128840/isolated/preview/c091629800ce3d91d8527d32d60bc46f-stopwatch-timer-by-vexels.png')
        .setDescription(
            `**Days:** ` + days + '\n' +
            `**Hours:** ` + hours + '\n' +
            `**Minutes:** ` +  minutes + '\n' +
            `**Seconds:** ` + seconds)
        .setColor('#dec047');
    message.channel.send(embed);
}

exports.conf = {
    name: "uptime",
    description: "*yawn* How long have I been awake?",
    usage: "uptime",
    aliases: []
}