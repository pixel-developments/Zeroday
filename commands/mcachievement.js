const { MessageEmbed, MessageAttachment } = require('discord.js')
const fs = require('fs');

exports.run = async (client, message, args, db) => {
    try {
        if(!args[0]) return message.reply('You need to input something to make an achievement!');

        message.channel.send(new MessageAttachment('https://www.minecraftskinstealer.com/achievement/a.php?i=20&h=Achievment+Get!&t=' + encodeURIComponent(args.join(' ')), 'mc.png'))
    } catch(err) {
        message.channel.send('There was an error!\n' + err).catch();
    }
}

exports.conf = {
    aliases: ['mca']
}