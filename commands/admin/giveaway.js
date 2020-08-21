const { MessageEmbed } = require('discord.js')
const ms = require('ms');

exports.run = async (client, message, args, db) => {
    let prefix, logChannel, logsEnabled;

    await db.collection('guild_settings').doc(message.guild.id).get().then(async (q) => {
        if (q.exists) {
            prefix = q.data().prefix;
            logChannel = message.guild.channels.cache.find(channel => channel.name === q.data().log_channel);
            logsEnabled = q.data().logs_enabled;

            if (q.data().prune === true) message.delete();
        }
    }).catch(err => {
        const errEmbed = new MessageEmbed()
            .setAuthor('Error!', 'https://cdn0.iconfinder.com/data/icons/shift-free/32/Error-512.png')
            .setDescription('An error occured while preforming this command!\nPlease visit the [Support server](https://discord.gg/6pjvxpR) to report this!')
            .addField(`Error`, err.name)
            .addField('Description', err.description)
            .setColor('a81d0d')
        message.channel.send(errEmbed);
    });

    db.collection('guilds').doc(message.guild.id).get().then(async (q) => {
        if (q.exists) {
            let admins = q.data().admins;
            if (!admins.includes(message.member.roles.highest.id)) return message.reply("You don't have permission to use this command!");

            if (!args[0]) return message.reply(`Invalid Arguments! | ${prefix}giveaway [time]`);
            if (!args[0].endsWith("d") && !args[0].endsWith("h") && !args[0].endsWith("m")) return message.reply(`You did not use the correct formatting for the time!`);
            if (isNaN(args[0][0])) return message.reply(`That is not a number!`);
            let channel = message.mentions.channels.first();
            if (!channel) return message.reply(`I could not find that channel!`);
            let prize = args.slice(2).join(" ");
            message.channel.send(`Giveaway created in ${channel}`);

            let embed = new MessageEmbed()
                .setAuthor(`Giveaway!`, message.author.displayAvatarURL)
                .addField('Host', message.author)
                .addField('Prize', prize)
                .addField('Time', msToTime(ms(args[0])))
                .setColor(`#28BDA2`);

            let m = await channel.send(embed);
            m.react(`🎉`);
            setTimeout(() => {
                if (m.reactions.cache.get(`🎉`).count <= 1) {
                    message.channel.send(`Reactions: ${m.reactions.cache.get(`🎉`).count}`);
                    return message.channel.send(`Not enough people reacted for me to draw a winner :(`);
                }

                let winner = m.reactions.cache.get(`🎉`).users.cache.filter((u) => !u.bot).random();
                channel.send(`The winner of the giveaway for ${prize} is... **${winner}**`)
            }, ms(args[0]));

        }
    }).catch(err => {
        const errEmbed = new MessageEmbed()
            .setAuthor('Error!', 'https://cdn0.iconfinder.com/data/icons/shift-free/32/Error-512.png')
            .setDescription('An error occured while preforming this command!\nPlease visit the [Support server](https://discord.gg/6pjvxpR) to report this!')
            .addField(`Error`, err.name)
            .addField('Description', err.description)
            .setColor('a81d0d')
        message.channel.send(errEmbed);
        console.log(err);
    });
}

exports.conf = {
    name: "giveaway",
    description: "Do a giveaway",
    usage: "<time> <channel> <prize>",
    category: "admin",
    aliases: []
}

function msToTime(s) {

    // Pad to 2 or 3 digits, default is 2
    function pad(n, z) {
        z = z || 2;
        return ('00' + n).slice(-z);
    }

    var ms = s % 1000;
    s = (s - ms) / 1000;
    var secs = s % 60;
    s = (s - secs) / 60;
    var mins = s % 60;
    var hrs = (s - mins) / 60;

    return pad(hrs) + ':' + pad(mins);
}