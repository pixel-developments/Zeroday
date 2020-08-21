const { MessageEmbed } = require('discord.js')
const fetch = require('node-fetch');

const subReddits = [
    'dog',
    'doggo',
    'puppy',
    'puppies',
    'corgi',
    'puppysmiles',
    'dogpictures',
    'tippytaps',
    'toofers',
    'woof_irl'
]

exports.run = async (client, message, args, db) => {
    const data = await fetch(`https://imgur.com/r/${subReddits[Math.floor(Math.random() * subReddits.length)]}/hot.json`)
        .then(response => response.json())
        .then(body => body.data);
    const selected = data[Math.floor(Math.random() * data.length)];

    let embed = new MessageEmbed()
        .setImage(`https://imgur.com/${selected.hash}${selected.ext.replace(/\?.*/, '')}`)
        .setTitle('The cute doggo you have always wanted')
        .setURL(`https://imgur.com/${selected.hash}${selected.ext.replace(/\?.*/, '')}`)

    let msg = await message.channel.send('Generating...');
    msg.edit(embed);
}

exports.conf = {
    name: "dog",
    description: "Cuteness overload!",
    usage: "",
    category: "fun",
    aliases: ['doggo', 'puppy']
}