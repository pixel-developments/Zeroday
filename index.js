const Discord = require('discord.js');
const client = new Discord.Client();
require('dotenv/config');

const admin = require('firebase-admin');
const serviceAccount = require('./firebase.json')
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://zeroday-4249f.firebaseio.com"
});

["commands", "aliases"].forEach(x => client[x] = new Discord.Collection());
["command", "events"].forEach(x => require(`./handler/${x}`)(client));


client.login(process.env.TOKEN).then(() => console.log(`Logged in as ${client.user.tag}`));