const { MessageEmbed } = require('discord.js')
const fetch = require('node-fetch');

const subReddits = [
    'dankmemes',
    'memes',
    'funny',
    'AdviceAnimals',
    'PrequelMemes',
    'terriblefacebookmemes'
]

exports.run = async (client, message, args, db) => {
    const data = await fetch(`https://imgur.com/r/${subReddits[Math.floor(Math.random() * subReddits.length)]}/hot.json`)
        .then(response => response.json())
        .then(body => body.data);
    const selected = data[Math.floor(Math.random() * data.length)];
    return message.channel.send(new MessageEmbed().setImage(`https://imgur.com/${selected.hash}${selected.ext.replace(/\?.*/, '')}`).setTitle('Here is your freshly cooked meme!').setURL(`https://imgur.com/${selected.hash}${selected.ext.replace(/\?.*/, '')}`));
}

exports.conf = {
    name: "meme",
    description: "MaKe moReE mEmeS ANthNonY",
    usage: "",
    category: "fun",
    aliases: []
}