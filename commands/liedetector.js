const { MessageEmbed } = require('discord.js')
const fs = require('fs');

exports.run = async (client, message, args, db) => {
    message.reply(`Your messages are ${Math.floor(Math.random() * 99)}% lies!`)
}

exports.conf = {
    aliases: []
}