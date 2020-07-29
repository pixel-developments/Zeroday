const {MessageEmbed} = require('discord.js');
const firebase = require('firebase-admin');
let db = firebase.firestore();
let prefix, auto_mod_enabled, banned_words, logChannel, logsEnabled;

module.exports = async (client, message) => {
    if(message.author.bot) return;
    if (!message.guild) return message.member.user.send('You must send a message in the a guild.');

    // Commands
    db.collection('guild_settings').doc(message.guild.id).get().then(q => {
        prefix = q.data().prefix;
        logChannel = message.guild.channels.cache.find(channel => channel.name === q.data().log_channel);
        logsEnabled = q.data().logs_enabled;

        //Auto Moderation
        auto_mod_enabled = q.data().automod_enabled;
        if(auto_mod_enabled === true) {
            banned_words = q.data().banned_words;

            for(var i = 0; i < banned_words.length; i++) {
                if(message.content.includes(banned_words[i]) && !message.startsWith(prefix)) {
                    message.delete();
                    message.reply('Please do not use foul language on this server!')
                    if(logsEnabled === true) {
                        let embed = new MessageEmbed()
                            .setAuthor('Auto Moderator', client.user.displayAvatarURL())
                            .setColor('#f27f13')
                            .setDescription(`I just removed a message from ${message.author} for: usage of a banned word.`)
                            .addField('Message Content', message.content);
                        logChannel.send(embed);
                    }
                }
            }
        }

        if (!message.content.startsWith(prefix)) return;

        const args = message.content.slice(prefix.length).trim().split(/ +/g);
        const cmd = args.shift().toLowerCase();
        if (cmd.length === 0) return;
        let command = client.commands.get(cmd);
        if (!command) command = client.commands.get(client.aliases.get(cmd));
        if (command) command.run(client, message, args, db);
    });

    // XP
    db.collection('guilds').doc(message.guild.id).collection('users').doc(message.member.user.id).get().then(async (q) => {
        if (message.member.user.bot) return;
        if (!q.exists) {
            await db.collection('guilds').doc(message.guild.id).collection('users').doc(message.member.user.id).set({
                'username': message.member.user.username,
                'id': message.member.user.id,
                'tag': message.member.user.tag,
                'xp': 0,
                'level': 1,
                'punishments': 0,
                'cases': []
            })
        }
        let multiplier;
        let dbRanks;
        if (q.exists) {
            await db.collection('guild_settings').doc(message.guild.id).get().then((m) => {
                if (m.exists) multiplier = m.data().xp_multiplier;
                dbRanks = m.data().rank_channel;
            })
            let xpAdd = (Math.ceil(Math.random() * 13) + 4) * multiplier;
            let curXP = q.data().xp;
            let curLvl = q.data().level;
            let nxtLvl = (curLvl * 450) + (curLvl * 100);
            let newXP = curXP + xpAdd;

            let ranks = message.guild.channels.cache.find(channel => channel.name === dbRanks); 

            db.collection('guilds').doc(message.guild.id).collection('users').doc(message.member.user.id).update({
                'xp': curXP + xpAdd
            })
            if (newXP >= nxtLvl) {
                db.collection('guilds').doc(message.guild.id).collection('users').doc(message.member.user.id).update({
                    'level': curLvl + 1
                })
                const rankEmbed = new MessageEmbed()
                    .setAuthor('Level up!', message.member.user.displayAvatarURL())
                    .setColor(message.member.displayHexColor)
                    .setDescription(`${message.member} has leveled up to lvl ${q.data().level}!`);

                ranks.send(rankEmbed);
            }
        }
    });
}