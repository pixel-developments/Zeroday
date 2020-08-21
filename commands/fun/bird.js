const { MessageEmbed } = require('discord.js')
const fetch = require('node-fetch');

const subReddits = [
    'birds',
    'birbs',
    'birdsbeingdicks',
    'budgies',
    'cockatiel',
    'conures',
    'birdpics'
]

exports.run = async (client, message, args, db) => {
    const data = await fetch(`https://imgur.com/r/${subReddits[Math.floor(Math.random() * subReddits.length)]}/hot.json`)
        .then(response => response.json())
        .then(body => body.data);
    const selected = data[Math.floor(Math.random() * data.length)];

    let embed = new MessageEmbed()
        .setImage(`https://imgur.com/${selected.hash}${selected.ext.replace(/\?.*/, '')}`)
        .setTitle('Here is your friendly neighborhood birb')
        .setURL(`https://imgur.com/${selected.hash}${selected.ext.replace(/\?.*/, '')}`)

    let msg = await message.channel.send('Generating...');
    msg.edit(embed);
}

exports.conf = {
    name: "bird",
    description: "BIRBS!",
    usage: "",
    category: "fun",
    aliases: ['birb']
}