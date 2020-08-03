const { MessageEmbed } = require('discord.js');
const firebase = require('firebase-admin');
let db = firebase.firestore();

module.exports = async (client, guild) => {
    await db.collection('guild_settings').doc(guild.id).set({
        'prefix': '>',
        'prune': true,
        'xp_multiplier': '1',
        'log_channel': 'logs',
        'member_log_channel': 'member-logs',
        'logs_enabled': true,
        'rank_channel': 'ranks',
        'ranks_enabled': true,
        'mute_role': 000000000000000000,
        'banned_words': [],
        'automod_enabled': true,
        'join_leave_channel': 'join-leave'
    });
    await db.collection('guilds').doc(guild.id).set({
        'guildID': guild.id,
        'guildName': guild.name,
        'guildOwner': guild.owner.user.tag,
        'guildOwnerID': guild.owner.user.id,
        'premium': false,
        'moderators': [],
        'admins': []
    });
    await db.collection('guilds').doc(guild.id).collection('users').doc('000000000000000000').set({
        'username': 'Template',
        'id': '000000000000000000',
        'tag': 'Template#0000',
        'xp': 0,
        'level': 1,
        'punishments': 0,
        'cases': []
    })

    let premium;
    await db.collection('guilds').doc(guild.id).get().then((q) => {
        if (q.exists) {
            premium = q.data().premium;
        } else {
            premium = false;
        }
    });

    console.log(`${guild.owner.user.tag} has added Aperture to their discord! >> ${guild.name} | ${guild.memberCount}`);

    let ownermsg = new MessageEmbed()
        .setTitle('ZeroDay Welcome!')
        .setThumbnail(client.user.displayAvatarURL())
        .setColor('#20b9be')
        .setDescription('Thank you for choosing ZeroDay for your all-in-one Discord experience!' +
        "\n" + '**1.** My default prefix is `>`' +
        "\n" + '**2.** Commands will not work in direct messages' +
        "\n" + '**3.** To change my prefix, use `>prefix`' +
        "\n" + '**4.** To get started, use >setup' +
        "\n" + '**5.** More to be added!');

    await guild.owner.user.send(ownermsg);
}