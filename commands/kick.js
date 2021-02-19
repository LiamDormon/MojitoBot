const Discord = require('discord.js');
const { staff_rank } = require('../config.json');
module.exports = {
    name: "kick",
    description: "Kick command",
    async execute(message, args) {
        if (message.member.roles.cache.get(staff_rank)) {
            const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
            if(!args[0]) return message.reply('Please specify a user');
            let reason = args.slice(1).join(" ");

            if(!reason) {
                reason = 'Unspecified Reason';
            }
            if (member.kickable) {
                try {
                    const KickEmbed = new Discord.MessageEmbed()
                        .setColor("#f00000")
                        .setTitle("You have been kicked from " + message.guild.name)
                        .setThumbnail(member.user.displayAvatarURL({ format: "png", dynamic: true }))
                        .setDescription(reason)
                        .setFooter('Mojito Bot')
                        .setTimestamp();
                    try { await member.send(KickEmbed) } 
                    catch(err) { console.error(err) }

                    member.kick(reason);
                    const ServerEmbed = new Discord.MessageEmbed()
                        .setColor('#f00000')
                        .setTitle(member.user.tag + ' was kicked!')
                        .setThumbnail(member.user.displayAvatarURL({ format: "png", dynamic: true }))
                        .setDescription(reason)
                        .setFooter('Mojito Bot')
                        .setTimestamp();

                    message.channel.send(ServerEmbed);
                } catch(err) {
                    console.error(err);
                }
            } else {
                message.reply("This member is not kickable");
            }
        } else {
            message.reply("You do not have permission to do this!");
        };
    }
}