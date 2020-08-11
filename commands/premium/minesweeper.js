const { MessageEmbed } = require('discord.js')
const Minesweeper = require('discord.js-minesweeper');
const fs = require('fs');

exports.run = async (client, message, args, db) => {
    await db.collection('guild_settings').doc(message.guild.id).get().then(async (q) => {
        if(q.exists) {
            if (q.data().prune === true) message.delete();
        }
    });

    db.collection('guilds').doc(message.guild.id).get().then(async (q) => {
        if(q.exists) {
            let premium = q.data().premium;
            if(premium === false) return message.reply('You need the premium version of ZeroDay to use this command!')
            message.channel.send('Generating...');

            let minesweeper;
            switch (args[0]) {
                case '1':
                    minesweeper = new Minesweeper({
                        rows: 5,
                        columns: 5,
                        mines: 4,
                    });
                break;
                case '2':
                    minesweeper = new Minesweeper({
                        rows: 7,
                        columns: 7,
                        mines: 6,
                        emote: 'tada',
                    });
                break;
                case '3':
                    minesweeper = new Minesweeper({
                        rows: 10,
                        columns: 10,
                        mines: 8,
                    });
                break;
                case '4':
                    minesweeper = new Minesweeper({
                        rows: 14,
                        columns: 14,
                        mines: 9,
                    });
                break;
                case '5':
                    minesweeper = new Minesweeper({
                        rows: 16,
                        columns: 16,
                        mines: 13,
                    });
                break;
                case '6':
                    minesweeper = new Minesweeper({
                        rows: 19,
                        columns: 19,
                        mines: 17,
                    });
                break;
                case '7':
                    minesweeper = new Minesweeper({
                        rows: 24,
                        columns: 24,
                        mines: 18,
                    });
                break;
                case '8':
                    minesweeper = new Minesweeper({
                        rows: 27,
                        columns: 27,
                        mines: 23,
                    });
                break;
                case '9':
                    minesweeper = new Minesweeper({
                        rows: 30,
                        columns: 30,
                        mines: 26,
                    });
                break;
                case '10':
                    minesweeper = new Minesweeper({
                        rows: 35,
                        columns: 35,
                        mines: 28,
                    });
                break;
                default:
                    minesweeper = new Minesweeper();
                break;
            }
            message.channel.send(minesweeper.start());
        }
    }).catch(err => {
        const errEmbed = new MessageEmbed()
            .setAuthor('Error!', 'https://cdn0.iconfinder.com/data/icons/shift-free/32/Error-512.png')
            .setDescription('An error occured while preforming this command!\nPlease visit the [Support server](https://discord.gg/6pjvxpR) to report this!')
            .addField(`Error`, err.name)
            .addField('Description', err.description)
            .setColor('a81d0d')
        message.channel.send(errEmbed);
    });
}

exports.conf = {
    name: "minesweeper",
    description: "The classic minesweeper game",
    usage: "minesweeper [difficulty 1-10]",
    category: "premium",
    aliases: []
}