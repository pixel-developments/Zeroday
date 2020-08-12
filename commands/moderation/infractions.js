const { MessageEmbed } = require('discord.js')
const fs = require('fs');
const { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } = require('constants');

exports.run = async (client, message, args, db) => {

    let prefix, logChannel, logsEnabled;

    db.collection('guild_settings').doc(message.guild.id).get().then(async (q) => {
        if (q.exists) {
            prefix = q.data().prefix;
            logChannel = message.guild.channels.cache.find(channel => channel.name === q.data().log_channel);
            logsEnabled = q.data().logs_enabled;

            if (q.data().prune === true) message.delete();
        }
    });

    db.collection('guilds').doc(message.guild.id).get().then(async (q) => {
        if (q.exists) {
            let mods = q.data().moderators;

            if (!mods.includes(message.member.roles.highest.id)) return message.reply("You don't have permission to use this command!");
            if (!args[0] || !args[1]) return message.reply(`Invalid Arguments! | ${prefix}inf [search|info] [user] [case]`)

            if (args[0] === "search") {
                let toSearch = message.guild.member(message.mentions.users.first()) || message.guild.members.cache.get(args[1]);
                let inf = await db.collection('guilds').doc(message.guild.id).collection('users').doc(toSearch.id).collection('infractions').get();
                let inf_data = inf.docs.map(doc => doc.data());

                let wcase = [], mcase = [], kcase = [], bcase = [];
                let twarn = "", tmute = "", tkick = "", tban = "";

                let embed = new MessageEmbed()
                    .setAuthor(toSearch.user.username, toSearch.user.displayAvatarURL())
                    .setColor(toSearch.displayHexColor)
                for (let doc of inf_data) {
                    if (doc.type.toLowerCase() === "warning") wcase.push(doc.number);
                    if (doc.type.toLowerCase() === "mute") mcase.push(doc.number);
                    if (doc.type.toLowerCase() === "kick") kcase.push(doc.number);
                    if (doc.type.toLowerCase() === "ban") bcase.push(doc.number);
                }
                twarn += wcase.map(x => `#${x}`).join(", ");
                tmute += mcase.map(x => `#${x}`).join(", ");
                tkick += kcase.map(x => `#${x}`).join(", ");
                tban += bcase.map(x => `#${x}`).join(", ");

                embed.addField(`Warning Count:  **\`${wcase.length}\`**`, twarn ? `**Cases:** ${twarn}` : "No warnings on record")
                embed.addField(`Mute Count:  **\`${mcase.length}\`**`, tmute ? `**Cases:** ${tmute}` : "No mutes on record")
                embed.addField(`Kick Count:  **\`${kcase.length}\`**`, tkick ? `**Cases:** ${tkick}` : "No kicks on record")
                embed.addField(`Ban Count:  **\`${bcase.length}\`**`, tban ? `**Cases:** ${tban}` : "No bans on record")
                embed.setFooter(`${toSearch.user.username} has ${inf.size} infractions.`)

                message.channel.send(embed);
            }
            if(args[0] === "info") {
                if(!args[2]) return message.reply('You must provide a case number!');
                if(isNaN(args[2])) return message.reply('The case number must be a number!');

                let toSearch = message.guild.member(message.mentions.users.first()) || message.guild.members.cache.get(args[1]);
                await db.collection('guilds').doc(message.guild.id).collection('users').doc(toSearch.id).collection('infractions').doc(args[2]).get().then(q => {
                    if(!q.exists) return message.reply('That case does not exist!')

                    let moderator = message.guild.members.cache.get(q.data().moderator)
                    let reason = q.data().reason;
                    let type = q.data().type;

                    let embed = new MessageEmbed()
                        .setAuthor(toSearch.user.username + ` | Case #${args[2]}`, toSearch.user.displayAvatarURL())
                        .setColor(toSearch.displayHexColor)
                        .addField(`Moderator`, moderator, true)
                        .addField(`Reason`, reason, true)
                        .addField(`Type`, type.charAt(0).toUpperCase() + type.slice(1), true);

                    message.channel.send(embed);
                });
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