const {ErelaClient, Utils } = require('erela.js');
const { nodes } = require("../../config.json");

module.exports = async client => {

    client.music = new ErelaClient(client, nodes)
        .on("nodeError", console.log)
        .on("nodeConnect", () => console.log('Successfully created a new Node.'))
        .on("queueEnd", player => {
            player.textChannel.send('Queue has ended.');
            return client.music.players.destroy(player.guild.id);
        })
        .on("trackStart", ({textChannel}, {title, duration}) => textChannel.send(`Now Playing **${title}** \`${Utils.formatTime(duration, true)}\``));

        client.levels = new Map() 
            .set("none", 0.0)
            .set("low", 0.10)
            .set("medium", 0.15)
            .set("high", 0.25);

    let activities = [`over ${client.guilds.cache.size} servers!`, `>help`], i = 0;
    setInterval(() => client.user.setActivity(activities[i++ % activities.length], { type: 'WATCHING' }), 60000)
}