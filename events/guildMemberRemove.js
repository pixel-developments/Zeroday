const {MessageEmbed} = require('discord.js');
const firebase = require('firebase-admin');
let db = firebase.firestore();

module.exports = (member) => {
    let logChannel, logsEnabled;

    db.collection('guild_settings').doc(member.guild.id).get().then(async (q) => {
        if (q.exists) {
            joinleave = guild.channels.cache.find(channel => channel.name === q.data().join_leave_channel);
            let embed = new MessageEmbed()
                .setDescription(`${member} has left the server!`)
                .setColor('78f0ee')
            joinleave.send(embed);
        }
    });
}