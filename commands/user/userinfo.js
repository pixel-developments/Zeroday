const { MessageEmbed } = require('discord.js')
const moment = require('moment');

exports.run = async (client, message, args, db) => {
    let prefix, logChannel, logsEnabled;

    await db.collection('guild_settings').doc(message.guild.id).get().then(async (q) => {
        if(q.exists) {
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

    if (!args[0]) return message.reply(`Invalid Arguments! | ${prefix}passwordstrength [password]`);

    let tagged = message.guild.member(message.mentions.users.first()) || message.guild.members.cache.get(args[0] || message.guild.members.cache.find(x => x.user.username.toLowerCase()));
    if(!tagged) return message.reply('That user is not in the Discord!');

    if (tagged.user.presence.status === 'dnd') tagged.user.presence.status = "🔴 Do Not Disturb";
    if (tagged.user.presence.status === 'online') tagged.user.presence.status = "🟢 Online";
    if (tagged.user.presence.status === 'idle') tagged.user.presence.status = "🟡 Idle";
    if (tagged.user.presence.status === 'offline') tagged.user.presence.status = "⚪ Offline";

    let x = Date.now() - tagged.user.createdAt;
    let y = Date.now() - tagged.joinedAt;
    const created = Math.floor(x / 8600000)
    const joined = Math.floor(y / 8600000)

    const joinedDate = moment.utc(tagged.joinedAt).format("dddd, MMMM Do YYYY, HH:mm")
    const createdDate = moment.utc(tagged.user.createdAt).format("dddd, MMMM Do YYYY, HH:mm")
    let status = tagged.user.presence.status;

    let embed = new MessageEmbed()
        .setColor(tagged.displayColor)
        .setAuthor(`${tagged.user.username}'s Information`, client.user.displayAvatarURL())
        .setThumbnail(tagged.user.displayAvatarURL())
        .addField('Username', tagged.user.username, true)
        .addField('ID', tagged.user.id, true)
        .addField('Status', status, true)
        .addField('Created At', `${createdDate} \n> ${created} days ago.`, true)
        .addField('Joined At', `${joinedDate} \n> ${joined} days ago.`, true)

    message.channel.send(embed);
}

exports.conf = {
    name: "userinfo",
    description: "Hmm... What are they doing over there?",
    usage: "userinfo [user]",
    category: "user",
    aliases: ['user', 'uinfo', 'whois']
}