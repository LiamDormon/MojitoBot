const { staff_rank } = require('../config.json');
const Discord = require('discord.js');
module.exports = {
    name: "say", 
    description: "Echoes user input in a tidy embed",
    execute(message, args) {
        if (message.member.roles.cache.get(staff_rank)) {
            var Attachment = (message.attachments).array();
            const Embed = new Discord.MessageEmbed()
            .setTitle(message.member.displayName)
            .setColor('#0099ff')
            .setDescription(args.join(' '))
            .setFooter('Mojito Bot')
            .setTimestamp()

            if (Attachment.length) {
                console.log("Added attatchment to embed")
                Embed.setImage(Attachment[0].proxyURL);
                Attachment = []
            }

            message.delete()
                .then(msg => console.log(`Deleted message from ${msg.author.tag}`))
                .catch(console.error);

            message.channel.send(Embed);
            
        }
        else {
            message.reply("You don't have permissions for this command")
        }
    }
}