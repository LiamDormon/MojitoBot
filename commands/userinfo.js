const Discord = require('discord.js');
const moment = require('moment');
module.exports = {
    name:"userinfo",
    description:"Fetch user info",
    execute(message, args) {
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

        const embed = new Discord.MessageEmbed()
        .setColor('#5cf000')
        .setTitle('User Info for **' + member.user.tag + '**')
        .setThumbnail(member.user.displayAvatarURL({ format: "png", dynamic: false }))
        .addField("Discord ID", member.id)
        .addField("Created Account", moment(member.user.createdAt).format('LLLL'))
        .addField("Joined Server", moment(member.joinedAt).format('LLLL'))

        .setFooter('Mojito Bot')
        .setTimestamp();

        message.channel.send(embed);
    }
}