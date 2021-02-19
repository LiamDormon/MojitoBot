const { staff_rank } = require('../config.json');
const Discord = require('discord.js');
module.exports = {
    name: "purge",
    description: "Will delete a specified number of messages",
    execute(message, args) {
        if (message.member.roles.cache.get(staff_rank)) {
            const amount = parseInt(args[0]);

            if (isNaN(amount)) {
                return message.reply('That doesn\'t seem to be a valid number.');
            } else if (amount < 2 || amount > 100) {
                return message.reply('You need to input a number between 2 and 100.');
            }
            else {
                message.channel.bulkDelete(amount, true).catch(err => {
                    console.error(err);
                    message.channel.send('There was an error trying to purge messages in this channel!');
                });
            }
        
        }
        else {
            return message.reply('You do not have permissions for this command');
        }
    }
}