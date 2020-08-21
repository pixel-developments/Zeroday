const { MessageEmbed, Message } = require('discord.js')
const functions = require('../../functions');

exports.run = async (client, message, args, db) => {
    let prefix, logChannel, logsEnabled;

    await db.collection('guild_settings').doc(message.guild.id).get().then(async (q) => {
        if (q.exists) {
            prefix = q.data().prefix;
            logChannel = message.guild.channels.cache.find(channel => channel.name === q.data().log_channel);
            logsEnabled = q.data().logs_enabled;

            if(q.data().prune === true) message.delete();
        }
    }).catch(err => functions.errorMessage(message.channel, err));

    await db.collection('guilds').doc(message.guild.id).collection('users').doc(message.member.user.id).get().then(async (q) => {
        if (q.exists) {
            let user = q.data().id;
            let dUser = message.guild.members.cache.get(user);

            let nextLvl = (q.data().level * 450) + (q.data().level * 100);
            console.log(nextLvl);
            let xpToNextLvl = nextLvl - q.data().xp

            let embed = new MessageEmbed()
                .setAuthor(`${dUser.user.username} Level`, client.user.displayAvatarURL())
                .setColor(message.member.displayColor)
                .addField('Level', q.data().level, true)
                .addField('XP', q.data().xp, true)
                .addField('Next Level', xpToNextLvl, true);

            message.channel.send(embed);
        }
    }).catch(err => functions.errorMessage(message.channel, err));
}

exports.conf = {
    name: "level",
    description: "Check out what level you are on the server",
    usage: "level",
    category: "user",
    aliases: ['lvl', 'rank', 'rnk']
}