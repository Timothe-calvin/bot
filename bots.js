const Discord = require("discord.js");

const client = new Discord.Client({
    intents:["GUILDS" , "GUILDS_MESSAGES", "GUILD_MEMBERS", "MESSAGE_CONTENT"],
    partials:["CHANNEL", "MESSAGE"],
})
