const answers = [
    'As I see it, yes',
    'Ask again later',
    'Better not tell you now',
    'Cannot predict right now',
    'Concertrate and ask again',
    'Do not count on it',
    'It is certain',
    'It is decidedly so',
    'Most likely',
    'My reply is no',
    'My sources say no',
    'Outlook not so good',
    'Reply hazy, try again',
    'Signs point to yes',
    'Very doubtful',
    'Without a doubt',
    'Yes',
    'Yes -- definitely',
    'You may rely on it'
]

exports.run = async (client, message, args, db) => {
    if(!args[0]) return message.reply(`Invalid Arguments! | ${prefix}8ball [question]`)
    message.reply(answers[Math.floor(Math.random() * answers.length)]);
}

exports.conf = {
    name: "8ball",
    description: "Will your wishes come true?",
    usage: "8ball [question]",
    category: "fun",
    aliases: ['8b']
}