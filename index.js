const Discord = require('discord.js');
const client = new Discord.Client();
require('dotenv/config');

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();

require('./handler/events')(client);
require('./handler/command')(client);

//Initialize Bot & Database
const admin = require('firebase-admin');
const serviceAccount = require('./firebase.json')

client.login(process.env.TOKEN).then(() => console.log(`Logged in as ${client.user.tag}`));
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://zeroday-4249f.firebaseio.com"
});