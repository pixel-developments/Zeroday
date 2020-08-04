const { MessageEmbed } = require('discord.js')
const { readdirSync } = require('fs');

exports.run = async (client, message, args, db) => {
    let prefix, logChannel, logsEnabled;

    db.collection('guild_settings').doc(message.guild.id).get().then(async (q) => {
        if (q.exists) {
            prefix = q.data().prefix;
            logChannel = message.guild.channels.cache.find(channel => channel.name === q.data().log_channel);
            logsEnabled = q.data().logs_enabled;

            if (q.data().prune === true) message.delete();
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

    const embed = new MessageEmbed()
        .setColor('#c72835')
        .setAuthor(`${message.guild.me.displayName} Help`, message.guild.iconURL)
        .setThumbnail(client.user.displayAvatarURL)

    if (!args[0]) {
        const categories = readdirSync('./commands/')

        embed.setDescription(`These are the available commands for ${message.guild.me.displayName}\nThe prefix is: **${prefix}**`)
        embed.setFooter(`${message.guild.me.displayName} | Total Commands: ${client.commands.size}`, client.user.displayAvatarURL)

        categories.forEach(category => {
            const dir = client.commands.filter(c => c.conf.category === category);
            const capitalize = category.slice(0, 1).toUpperCase() + category.slice(1);

            try {
                embed.addField(`> ${capitalize} [${dir.size}]: `, dir.map(c => `\`${c.conf.name}\``).join(' '))
            } catch (err) {
                const errEmbed = new MessageEmbed()
                    .setAuthor('Error!', 'https://cdn0.iconfinder.com/data/icons/shift-free/32/Error-512.png')
                    .setDescription('An error occured while preforming this command!\nPlease visit the [Support server](https://discord.gg/6pjvxpR) to report this!')
                    .addField(`Error`, err.name)
                    .addField('Description', err.description)
                    .setColor('a81d0d')
                message.channel.send(errEmbed);
            }
        });

        return message.channel.send(embed);
    } else {
        let command = client.commands.get(client.aliases.get(args[0].toLowerCase()) || args[0].toLowerCase());
        if(!command) return message.reply(embed.setTitle('Invalid Command').setDescription(`Do \`${prefix}help\` for the list of the commands`));
        command = command.conf;

        embed.setDescription(`${message.guild.me.displayName}'s prefix is: **${prefix}**`
            + '\n' + `**Command:** ${command.name.slice(0, 1).toUpperCase() + command.name.slice(1)}`
            + '\n' + `**Description:** ${command.description || "No description provided"}`
            + '\n' + `**Usage:** ${command.usage ? `\`${prefix}${command.name} ${command.usage}\`` : `No Usage`}`
            + '\n' + `**Aliases:** ${command.aliases ? command.aliases.join(", ") : `None`}`)

        return message.channel.send(embed);
    }

}

exports.conf = {
    name: "help",
    description: "Help me!",
    usage: "help [command]",
    category: "user",
    aliases: []
}