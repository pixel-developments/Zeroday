const zxcvbn = require('zxcvbn');
const { MessageEmbed } = require('discord.js')
const fs = require('fs');

exports.run = async (client, message, args, db) => {
    let prefix, logChannel, logsEnabled;
    db.collection('guild_settings').doc(message.guild.id).get().then(async (q) => {
        if(q.exists) {
            prefix = q.data().prefix;
            logChannel = message.guild.channels.cache.find(channel => channel.name === q.data().log_channel);
            logsEnabled = q.data().logs_enabled;

            if (q.data().prune === true) message.delete();
        }
    }).catch(err => message.channel.send('There was an error preforming this command! Please try again in a second. (Timeout)'));

    if(!args[0]) return message.reply(`Invalid Arguments! | ${prefix}passwordstrength [password]`);

    let res = zxcvbn(args.join(' '));
    let scorefr = '';
    if (res.score == 0) scorefr = 'Very Weak';
    if (res.score == 1) scorefr = 'Weak';
    if (res.score == 2) scorefr = 'Medium';
    if (res.score == 3) scorefr = 'Strong';
    if (res.score == 4) scorefr = 'Very Strong';

    let embed = new MessageEmbed()
        .setAuthor('Password Strength', 'https://www.graphicsprings.com/filestorage/stencils/20a9b04fb7dfcc77a3150daa16491cd1.png?width=500&height=500')
        .addField('Score', res.score + ' - ' + scorefr)
        .addField('Throttled Online Attack Crack Time', res.crack_times_display.online_throttling_100_per_hour || 'Not Available')
        .addField('Unthrottled Online Attack Crack Time', res.crack_times_display.online_no_throttling_10_per_second || 'Not Available')
        .addField('Offline attack, slow hash, many cores Crack Time', res.crack_times_display.offline_slow_hashing_1e4_per_second || 'Not Available')
        .addField('Offline attack, fast hash, many cores Crack Time', res.crack_times_display.offline_fast_hashing_1e10_per_second || 'Not Available')

    switch(res.score) {
        case 0:
            embed.setColor('#8c0707')
            break;
        case 1:
            embed.setColor('#c22323')
            break;
        case 2:
            embed.setColor('#e8a813')
            break;
        case 3:
            embed.setColor('#11ff00')
            break;
        case 4:
            embed.setColor('#17c90a')
            break;
    }
    message.channel.send(embed);
}

exports.conf = {
    aliases: ['pswdstrength', 'pswdstr']
}