const { MessageEmbed } = require('discord.js')
const fs = require('fs');

exports.run = async (client, message, args, db) => {


    let disabledEmbed = new MessageEmbed()
        .setColor("#a81d0d")
        .setAuthor('Command Disabled', message.guild.iconURL)
        .setDescription('I am still working on this command. Please be patient until it is done.');
    return message.channel.send(disabledEmbed);

    let prefix, logChannel, logsEnabled;

    db.collection('guild_settings').doc(message.guild.id).get().then(async (q) => {
        if(q.exists) {
            prefix = q.data().prefix;
            logChannel = message.guild.channels.cache.find(channel => channel.name === q.data().log_channel);
            logsEnabled = q.data().logs_enabled;

            if (q.data().prune === true) message.delete();
        }
    });

    db.collection('guilds').doc(message.guild.id).get().then(async (q) => {
        if(q.exists) {
            let dbOwner = q.data().guildOwnerID;
            let premium = q.data().premium;
            let mods = q.data().moderators;

            if (!mods.includes(message.member.roles.highest.id)) return message.reply("You don't have permission to use this command!");
            if(!args[0] || !args[1]) return message.reply(`Invalid Arguments! | ${prefix}inf [search|info|reason] [user|case]`)

            if(args[0] === "search") {
                let toSearch = message.guild.member(message.mentions.users.first()) || message.guild.members.cache.get(args[1]);
                let inf = await db.collection('guilds').doc(message.guild.id).collection('users').doc(toSearch.id).collection('infractions').get();
                let inf_data = inf.docs.map(doc => doc.data());

                for (let doc of inf_data) {
                    console.log(doc)
                 }
            }
        }
    });
}

exports.conf = {
    name: "infractions",
    description: "Get the specified users infractions.",
    usage: "infractions [search|info|reason] [user|case]",
    category: "moderation",
    aliases: ['inf']
}