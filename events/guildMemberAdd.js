const {MessageEmbed} = require('discord.js');
const firebase = require('firebase-admin');
let db = firebase.firestore();

module.exports = member => {
    console.log(member.guild.id);
}