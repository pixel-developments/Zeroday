const { MessageEmbed } = require('discord.js')
const fs = require('fs');

exports.run = async (client, message, args, db) => {
    if (message.member.user.id !== '270304325870419978') return;
    message.delete();

    let about = new MessageEmbed()
        .setAuthor('About ZeroDay', client.user.displayAvatarURL())
        .setColor('#405d7c')
        .setDescription('ZeroDay is a customizable Discord Bot for your Discord server. We feature simple to use commands *(dashboard coming soon)*, and lots of features including:'
        + '\n' + '‣ Auto Moderation'
        + '\n' + '‣ Role Management'
        + '\n' + '‣ Community Activites/Games'
        + '\n' + 'and much more that will greatly help moderation and user activity in your server.'
        + '\n' + '\n' + 'Stay tuned on this server to get regular updates on the bot and release!'
        + '\n' + '\n' + '\n' + '**[ZeroDay Coming Soon...]**'
        + '\n' + '__' + '\n' + '**[Invite to Support Server](https://discord.gg/6pjvxpR)**')

    let rules = new MessageEmbed()
        .setAuthor('Server Rules', 'https://media1.tenor.com/images/54cc77830f82ef67471d8d868d09ad2f/tenor.gif?itemid=11230336')
        .setColor('#405d7c')
        .setDescription('As we are apart of the Discord community, we have to uphold the Terms and Guidelines set by Discord themselves.' + '\n' + '__'
        + '\n' + '[Discord ToS](https://discord.com/new/terms)'
        + '\n' + '[Discord Guidelines](https://discord.com/new/guidelines)'
        + '\n' + '\n' + '*You are expected to follow the rules. If you do not, you are subject to punishment.*'
        + '\n' + '\n' + '**• No talking about other bots in a negative tone**'
        + '\n' + '\n' + '**• No NSFW/NSFL content or discussions**'
        + '\n' + '\n' + '**• No Spamming**' + '\n' + 'This includes walls of text, images, commands, etc.'
        + '\n' + '\n' + '**• No advertisement of any kind**' + '\n' + 'This includes other Discord servers, bots, social media (This also included DM Advertisement)'
        + '\n' + '\n' + '**• No impersonations of users, bots, Discord Staff, etc.**'
        + '\n' + '\n' + '**• Use common sense, it is not that hard**'
        + '\n' + '\n' + '\n' + 'Moderators are allowed to moderate at their own discretion. We are all humans, so mistakes can be made. That being said, any loopholes found in the rules that are used and are not reported, will get you banned from the server. Use common sense and do not fight with staff as they are trying to keep the server a peaceful and safe place for everyone.')

    message.channel.send(about);
    message.channel.send(rules);
}

exports.conf = {
    name: "welcome",
    description: "Welcome message for the ZeroDay support server.",
    usage: "welcome",
    category: "bot_owner",
    aliases: []
}