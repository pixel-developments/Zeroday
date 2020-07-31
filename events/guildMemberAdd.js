const {MessageEmbed} = require('discord.js');
const firebase = require('firebase-admin');
let db = firebase.firestore();

module.exports = (member) => {
    let logChannel, logsEnabled;
    const guild = member.guild;

    db.collection('guild_settings').doc(guild.id).get().then(async (q) => {
        if (q.exists) {
            joinleave = guild.channels.cache.find(channel => channel.name === q.data().join_leave_channel);
            let embed = new MessageEmbed()
                .setDescription(`${member} has joined the server!`)
                .setColor('78f0ee')
            joinleave.send(embed);
        }
    });

    /*db.collection('alert_users').doc(member.user.id).get().then(q => {
        if(!q.exists) return;
        let map = q.data();

        let warningEmbed = new MessageEmbed()
            .setAuthor(`User Warning`, client.user.displayAvatarURL())
            .setColor('#961219')
            .setDescription(`${member.user.username} has been banned in other servers using the ZeroDay bot. Please check below for the servers.`)
        logChannel.send(warningEmbed);

        let number = 0;
        for(const [key, value] of Object.entries(map)) {
            number++;
            if(number === 4 && Object.keys(map).length > 3) {
                let moreEmbed = new MessageEmbed()
                    .setColor('#961219')
                    .setDescription(`+${Object.keys(map).length - 3} server(s)`);
                logChannel.send(moreEmbed);
                break;
            }

            let embed = new MessageEmbed()
                .setColor('#961219')
                .addField('Server', key)
                .addField('Reason', Object.values(value)[1], true)
                .addField('Proof', Object.values(value)[0], true)

            logChannel.send(embed);
        }
    });*/
}