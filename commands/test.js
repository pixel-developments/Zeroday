const { MessageEmbed } = require('discord.js')

exports.run = async (client, message, args, db) => {
    const errEmbed = new MessageEmbed()
        .setAuthor('Error!', 'https://cdn0.iconfinder.com/data/icons/shift-free/32/Error-512.png')
        .setDescription('An error occured while preforming this command!\nPlease visit the [Support server](https://discord.gg/6pjvxpR) to report this!')
        .addField(`Error`, 'Undefined')
        .addField('Description', 'The dipshit developer forgot something')
        .setColor('a81d0d')
        message.channel.send(errEmbed);
}

exports.conf = {
    aliases: []
}