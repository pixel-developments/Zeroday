let {MessageEmbed} = require('discord.js');

module.exports = {
    errorMessage: function(channel, err) {
        const errEmbed = new MessageEmbed()
            .setAuthor('Error!', 'https://cdn0.iconfinder.com/data/icons/shift-free/32/Error-512.png')
            .setDescription('An error occured while preforming this command!\nPlease visit the [Support server](https://discord.gg/6pjvxpR) to report this!')
            .addField(`Error`, err.name)
            .addField('Description', err.description)
            .setColor('a81d0d')
        channel.send(errEmbed);
    },

    getPrefix: function(db, guildID) {
        db.collection('guild_settings').doc(guildID).get().then(async (q) => {
            if (q.exists) return prefix = q.data().prefix;
        }).catch(err => errorMessage(message.channel, err));
    }
}