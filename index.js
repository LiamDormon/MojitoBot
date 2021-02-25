// Get Required Modules
const Discord = require('discord.js');
const fs = require('fs');
const { token, prefix, join_roles } = require('./config.json');
//const request = require('request');
const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

// Initialize the invite cache
const guildInvites = new Map();

//// Discord Bot Log in
client.once('ready', async () => {
    console.log(`Logged as ${client.user.tag} correctly!`)
    var TICK_MAX = 1 << 9;
    var TICK_N = 0;
    setInterval(async () => {
        var status = TICK_N % 2 === 0 ? 'Being Useful' : 'With My Pickle'
        client.user.setActivity(status, {
            type: 'PLAYING',
        });
        TICK_N++;
        if (TICK_N >= TICK_MAX) {
            TICK_N = 0;
        }
    }, 30 * 1000);

    // Fetches discord invites and adds to map
    client.guilds.cache.forEach(guild => {
        guild.fetchInvites()
            .then(invites => guildInvites.set(guild.id, invites))
            .catch(err => console.log(err));
    });
});

// Adds new invites to map
client.on('inviteCreate', async invite => guildInvites.set(invite.guild.id, await invite.guild.fetchInvites()));

client.login(token);

//// Commands

client.on('message', message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();
    if (!client.commands.has(command)) return;

    try {
        client.commands.get(command).execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply('there was an error trying to execute that command!');
    }    
});

///// Join Server Welcome Message & Give Role
client.on('guildMemberAdd', async member => {
    if (Date.now() - member.user.createdAt > 1000*60*60*24*30) {
        const KickEmbed = new Discord.MessageEmbed()
        .setColor("#f00000")
        .setTitle("You have been kicked from " + message.guild.name)
        .setThumbnail(member.user.displayAvatarURL({ format: "png", dynamic: true }))
        .setDescription("Your discord account must be at least 30 days old.")
        .setFooter('Mojito Bot')
        .setTimestamp();
        try { await member.send(KickEmbed) } 
        catch(err) { console.error(err) }

        member.kick("Account to new");
    }

    member.roles.add(join_roles);

    const cachedInvites = guildInvites.get(member.guild.id);
    const newInvites = await member.guild.fetchInvites();
    guildInvites.set(member.guild.id, newInvites)
    try {
        const inviteUsed = newInvites.find(inv => cachedInvites.get(inv.code).uses < inv.uses);

        const welcomeEmbed = new Discord.MessageEmbed()
            .setColor('#5cf000')
            .setTitle('Welcome **' + member.user.tag + '**')
            .setThumbnail(member.user.displayAvatarURL({ format: "png", dynamic: true }))
            .addField("Invite",`Used invite **${inviteUsed.code}** from **${inviteUsed.inviter.tag}**. Invite has been used ${inviteUsed.uses} times.`)
            .setFooter('Mojito Bot')
            .setTimestamp();

        member.guild.channels.cache.find(i => i.name === 'welcome').send(welcomeEmbed);
    }
    catch(err) {
        console.log(err);
    }
})

client.on('guildMemberRemove', member => {
    const goodbyeEmbed = new Discord.MessageEmbed()
        .setColor('#f00000')
        .setTitle('**' + member.user.tag + '** has left')
        .setThumbnail(member.user.displayAvatarURL({ format: "png", dynamic: true }))
        .setDescription('Good bye :wave:')
        .setFooter('Mojito Bot')
        .setTimestamp()

    member.guild.channels.cache.find(i => i.name === 'welcome').send(goodbyeEmbed)
})

process.on('unhandledRejection', error => {
	console.error('Unhandled promise rejection:', error);
});
