const Discord = require('discord.js');
module.exports = {
    name: "suggest", 
    description: "Makes a suggestion embed and adds reactions for people to vote",
    execute(message, args) {
        const Embed = new Discord.MessageEmbed()
        .setTitle(`Suggestion from ${message.author.tag }`)
        .setColor('#FFC308')
        .setThumbnail(message.author.displayAvatarURL({ format: "png", dynamic: true }))
        .setDescription(args.join(' '))
        .addField('Submitter ID',  message.author.id)
        .setFooter('Mojito Bot')
        .setTimestamp()

        message.delete()
            .then(msg => console.log(`Suggestion from ${msg.author.username}`))
            .catch(console.error);

        message.guild.channels.cache.get('792864583508819970').send(Embed)
        .then(function (message) {
            message.react('✅');
            message.react('❌');
        })
    }
}