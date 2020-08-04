const { readdirSync } = require('fs');

module.exports = (client) => {
    const load = dirs => {
        const commands = readdirSync(`./commands/${dirs}/`).filter(d => d.endsWith('.js'));
        for(let file of commands) {
            const pull = require(`../commands/${dirs}/${file}`);
            client.commands.set(pull.conf.name, pull);
            if(pull.conf.aliases) pull.conf.aliases.forEach(a => client.aliases.set(a, pull.conf.name));
        }
    }
    ["admin", "bot_owner", "moderation", "owner", "premium", "user", "music"].forEach(x => load(x));
}