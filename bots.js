const Discord = require("discord.js");

const client = new Discord.Client({
    intents:["GUILDS" , "GUILDS_MESSAGES", "GUILD_MEMBERS", "MESSAGE_CONTENT"],
    partials:["CHANNEL", "MESSAGE"],
})
// remember to change bot token after uploading
const token = ("")


client.on('ready',async()=>{
console.log(`client has been initiated! ${client.user.username}`);
});
