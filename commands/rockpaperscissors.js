const { MessageEmbed } = require("discord.js");

const { MessageEmbed} = require('discord.js')

const answers = [
    'rock',
    'paper',
    'scissors',
]

exports.run = async (client, message, args, db) => {
    if(!args[0]) return message.reply(`Invalid Arguments! | ${prefix}rps [rock|paper|scissors]`)
    
    const random = Math.floor(Math.random() * answers.length);
    const result = answers[random];
    const choice = args[0];

    let embed = new MessageEmbed()
        .setAuthor('Rock, Paper, Scissors', 'https://media2.giphy.com/media/jqI3buvbN3EitBjHfB/giphy.gif')
        .addField('Your Choice:', choice.toLowerCase())
        .addField('My Choice', result.toLowerCase());

    if(result.toLowerCase() == choice.toLowerCase()) {
        embed.setDescription("It's a tie!")
        return message.channel.send(embed);
    }

    switch(choice) {
        case 'rock': {
            if(result === 'paper') {
                embed.setDescription("I Won!");
            } else {
                embed.setDescription("You Won!")
            }
        }
        case 'paper': {
            if(result === 'scissors') {
                embed.setDescription("I Won!");
            } else {
                embed.setDescription("You Won!")
            }
        }
        case 'scissors': {
            if(result === 'rock') {
                embed.setDescription("I Won!");
            } else {
                embed.setDescription("You Won!")
            }
        }
    }
}

exports.conf = {
    aliases: ['rps']
}