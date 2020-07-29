const { MessageEmbed } = require('discord.js')
const fs = require('fs');

let keys = require('../keys.json');

exports.run = async (client, message, args, db) => {
    if(message.member.user.id !== '270304325870419978') return;
    let userKey = randomString(10, '#aA');

    if(!keys[userKey]) {
        keys[userKey] = {
            valid: true
        }
        fs.writeFile('./keys.json', JSON.stringify(keys, null, 4), (err) => {
            if(err) console.log(`Error in saving key to file:\n${err}`);
        });
        message.channel.send(`New key added! **${userKey}**`);
    }
}
exports.conf = {
    aliases: ['addkey']
}

function randomString(length, chars) {
    var mask = '';
    if (chars.indexOf('a') > -1) mask += 'abcdefghijklmnopqrstuvwxyz';
    if (chars.indexOf('A') > -1) mask += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (chars.indexOf('#') > -1) mask += '0123456789';
    if (chars.indexOf('!') > -1) mask += '~`!@#$%^&*()_+-={}[]:";\'<>?,./|\\';
    var result = '';
    for (var i = length; i > 0; --i) result += mask[Math.floor(Math.random() * mask.length)];
    return result;
}