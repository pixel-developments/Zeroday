const {Discord, Collection} = require('discord.js');
const client = new Discord.Client();
require('dotenv/config');

["commands", "aliases"].forEach(x => client[x] = new Collection());
["command", "events"].forEach(x => require(`./handler/${x}`)(client));

//Initialize Bot & Database
const admin = require('firebase-admin');
const serviceAccount = require('./firebase.json')

client.login(process.env.TOKEN).then(() => console.log(`Logged in as ${client.user.tag}`));
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://zeroday-4249f.firebaseio.com"
});