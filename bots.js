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

client.on('messageCreate', async(message)=>{
    if (message.content.toLowerCase() === "test") {
    message.reply("test successful").catch(err => console.error(err))
    }
    });
    

client.login(token);