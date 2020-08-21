const { MessageEmbed } = require('discord.js')
const fs = require('fs');
const { set } = require('mongoose');

exports.run = async (client, message, args, db) => {

    // + '\n' + '\n' + "" + '\n' + ""

    /*let setup = new MessageEmbed()
        .setAuthor('ZeroDay Setup', client.user.displayAvatarURL())
        .setColor('#405d7c')
        .setDescription("*Thank you for choosing to setup ZeroDay! Below, you will find a list of commands you need to run to get the server set-up and going! After that, you won't have to touch anything.*"
        + '\n' + '\n' + "**>setlogs [channel name]**" + '\n' + "Set up the log channel where mod actions will go."
        + '\n' + '\n' + "**>setmemberlogs [channel name]**" + '\n' + "Set up the channel where punishments will go."
        + '\n' + '\n' + "**>setrank [channel name]**" + '\n' + "Set up the rank channel where level-up events will go."
        + '\n' + '\n' + "**>setmute [mute role id]**" + '\n' + "Set up the role players will get when they are muted."
        + '\n' + '\n' + "**>addmod [mod role id]**" + '\n' + "Set up the mod roles so that they can use staff commands."
        + '\n' + '\n' + "**>addadmin [admin role id]**" + '\n' + "Set up the admin roles so that they can use more advance commands.")*/

    let setup = new MessageEmbed()
        .setAuthor('ZeroDay Setup', client.user.displayAvatarURL())
        .setColor('#405d7c')
        .setDescription(`Thank you for using ZeroDay! Here, you get to configure the bot to your liking. Please follow the following prompts.`)
    message.channel.send(setup);

    const filter = m => m.author.id === message.author.id;
    message.reply(`What channel would you like your logs in?`)
    message.channel.awaitMessages(filter, {
        max: 1,
        time: 10000
    }).then(collector => {
        let logs = message.guild.channel
    })

}

exports.conf = {
    name: "setup",
    description: "How to setup the bot",
    usage: "setup",
    category: "owner",
    aliases: []
}