const { readdirSync } = require('fs');
const { equal } = require('assert');

module.exports = (client) => {
    const load = dirs => {
        const commands = readdirSync(`./events/${dirs}/`).filter(d => d.endsWith('.js'));
        for(let file of events) {
            const evt = require(`../events/${dir}/${file}`)
            let eName = file.split('.')[0];
            client.on(eName, evt.bind(null, client))
        }
    }
    ["client", "guild"].forEach(x => load(x));
}