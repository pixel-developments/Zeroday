const { MessageEmbed } = require('discord.js')

exports.run = async (client, message, args, db) => {
    const errEmbed = new MessageEmbed()
        .setAuthor('Error!', 'https://cdn0.iconfinder.com/data/icons/shift-free/32/Error-512.png')
        .setDescription('An error occured while preforming this command!')
        .addField(`Error`, 'Undefined')
        .addField('Description', 'The dipshit developer forgot something')
        .setFooter('Please report this back to Zuke on the ZeroDay Support server (Click title)')
        .setURL('https://discord.gg/6pjvxpR')
        .setColor('a81d0d')
        message.channel.send(errEmbed);
}

exports.conf = {
    aliases: []
}