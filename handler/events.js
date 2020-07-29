const fs = require('fs')
const util = require('util');

const promisify = util.promisify;
const readdir = promisify(fs.readdir);

module.exports = (client) => {
    readdir(__dirname + '/../events', (err, files) => {
        if(err) return console.log(err);

        files.forEach(file => {
            if(!file.endsWith('js')) return;

            const event = require(`../events/${file}`);
            let eventName = file.split('.')[0];
            client.on(eventName, event.bind(null, client));

            delete require.cache[require.resolve(`../events/${file}`)];
            console.log(`Loading event: ${eventName}`);
        })
    })
}