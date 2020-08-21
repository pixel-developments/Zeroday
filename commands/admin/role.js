const { MessageEmbed } = require('discord.js')
const functions = require('../../functions');

exports.run = async (client, message, args, db) => {
    let prefix, logChannel, logsEnabled, banned_words;

    await db.collection('guild_settings').doc(message.guild.id).get().then(async (q) => {
        if (q.exists) {
            prefix = q.data().prefix;
            logChannel = message.guild.channels.cache.find(channel => channel.name === q.data().log_channel);
            logsEnabled = q.data().logs_enabled;
            banned_words = q.data().banned_words;

            if (q.data().prune === true) message.delete();
        }
    }).catch(err => functions.errorMessage(message.channel, err));

    await db.collection('guilds').doc(message.guild.id).get().then(async (q) => {
        if (q.exists) {
            let admins = q.data().admins;
            if (!admins.includes(message.member.roles.highest.id)) return message.reply("You don't have permission to use this command!");
            if (!args[0] || !args[1]) return message.reply(`Invalid Arguments! | ${prefix}role <create|delete> <role name> [hex color]`)

            let embed = new MessageEmbed()
                .setColor('#3765b0')
                .setAuthor('System', client.user.displayAvatarURL())

            if (args[0] === "create") {
                embed.setDescription(`${message.member.user.tag} (${message.member}) | Created a new role: ${args[1]}`);
                if(args[2]) {
                    message.guild.roles.create({
                        data: {
                            name: args[1],
                            color: args[2]
                        }
                    });
                } else {
                    message.guild.roles.create({ data: { name: args[1] }});
                }
            } else if(args[0] === "delete") {
                let role = message.guild.roles.cache.find(r => r.name === args[1]);
                if(!role) return message.reply('That role does not exist!');
                role.delete();
                embed.setDescription(`${message.member.user.tag} (${message.member}) | Deleted the role: ${args[1]}`);
            }

            if (logsEnabled && logChannel != undefined) logChannel.send(embed);
        }
    }).catch(err => {
        functions.errorMessage(message.channel, err)
        console.log(err);
    });
}

exports.conf = {
    name: "role",
    description: "Create/Delete roles",
    usage: "<create|delete> <role name>",
    category: "admin",
    aliases: []
}