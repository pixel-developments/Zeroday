const {MessageEmbed} = require('discord.js');
const firebase = require('firebase-admin');
let db = firebase.firestore();

module.exports = (client, member) => {
    console.log(member.guild.id);
}