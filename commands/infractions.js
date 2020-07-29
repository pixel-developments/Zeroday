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
                let inf = await db.collection('guilds').doc(message.guild.id).collection('users').doc(toSearch.id).collection('infractions').get(doc => {
                    let temp = [];
                    const response = data.forEach((doc) => {
                        temp.push(doc.data())
                     })
                     return temp;
                });

                for (let doc of inf) {
                    console.log(doc)
                 }
                
                
                /*console.log(size);
                if(size === 0) return message.reply(`The user ${toSearch} does not have an infraction history.`);
                for(inf = 0; inf < size; inf++) {
                    console.log(inf);
                }*/
            }
        }
    });
}

exports.conf = {
    aliases: ['inf']
}