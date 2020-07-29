const { MessageEmbed } = require('discord.js')
const fs = require('fs');
const { O_NOCTTY } = require('constants');
const { KeyObject } = require('crypto');

exports.run = async (client, message, args, db) => {

    db.collection('alert_users').doc(message.member.user.id).get().then(q => {
        if(!q.exists) return;
        let map = q.data();

        let user = message.guild.member(message.member.id);
        let warningEmbed = new MessageEmbed()
            .setAuthor(`User Warning`, client.user.displayAvatarURL())
            .setColor('#961219')
            .setDescription(`${user.user.username} has been banned in other servers using the ZeroDay bot. Please check below for the servers.`)
        message.channel.send(warningEmbed);

        let number = 0;
        for(const [key, value] of Object.entries(map)) {
            //console.log(key, value);
            //serverList.push(key);

            //console.log(Object.values(value)[1])

            number++;
            if(number === 4) {
                let moreEmbed = new MessageEmbed()
                    .setColor('#961219')
                    .setDescription(`+${Object.keys(map).length - 3} server(s)`);
                message.channel.send(moreEmbed);
                break;
            }

            let embed = new MessageEmbed()
                .setColor('#961219')
                .addField('Server', key)
                .addField('Reason', Object.values(value)[1], true)
                .addField('Proof', Object.values(value)[0], true)

            message.channel.send(embed);
        }

        //console.log('Server List:', serverList);
    });
}

exports.conf = {
    aliases: []
}