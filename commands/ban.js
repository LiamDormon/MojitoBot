const { staff_rank } = require('../config.json');
const Discord = require('discord.js');
module.exports = {
    name: "ban", 
    description: "Ban command",
    async execute(message, args) {
        if (message.member.roles.cache.get(staff_rank)) {
            const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

            if(!args[0]) return message.reply('Please specify a user');
            let banreason = args.slice(1).join(" ");

            if(!banreason) {
                banreason = 'Unspecified Reason';
            }

            if(!member) {
                try {
                    message.guild.members.ban(args[0],{ days: 7, reason: banreason }).catch(err => { 
                        message.channel.send('Something went wrong')
                        console.log(err)
                    })
                    var banEmbed = new Discord.MessageEmbed()
                    .setColor('#f00000')
                    .setTitle(args[0] + ' was banned!')
                    .setDescription(banreason)
                    .setFooter('Mojito Bot')
                    .setTimestamp();
                }
                catch(err) {
                    message.reply('Can\'t seem to find this user');
                    console.log(err)
                }
            }else {
                if(!member.bannable) return message.reply('This user can\'t be banned. It is either because they are a mod/admin, or their highest role is higher than mine');

                if(member.id === message.author.id) return message.reply('Bruh, you can\'t ban yourself!');

                var userEmbed = new Discord.MessageEmbed()
                .setColor('#f00000')
                .setTitle("You were banned from " + message.guid.name)
                .setDescription(banreason)
                .setFooter('Mojito Bot')
                .setTimestamp();

                try { await message.member.send(userEmbed) } 
                catch(err) { console.error(err) }
                
                member.ban({ days: 7, reason: banreason }).catch(err => { 
                    message.channel.send('Something went wrong')
                    console.log(err)
                })

                var banEmbed = new Discord.MessageEmbed()
                .setColor('#f00000')
                .setTitle(member.user.tag + ' was banned!')
                .setThumbnail(member.user.displayAvatarURL({ format: "png", dynamic: true }))
                .setDescription(banreason)
                .setFooter('Mojito Bot')
                .setTimestamp();
            }
            

            try { message.channel.send(banEmbed) } 
            catch (error) { console.log(error) }
        } else {
            message.reply("You do not have permissions to do this")
        }
    }
}