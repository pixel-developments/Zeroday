exports.run = async (client, message, args, db) => {
    message.reply(`Your messages are ${Math.floor(Math.random() * 99)}% lies!`)
}

exports.conf = {
    name: "liedetector",
    description: "Are you lying about anything? Fess up now",
    usage: "liedetector",
    category: "fun",
    aliases: []
}