require('dotenv').config();
const { Client, IntentsBitField } = require("discord.js");

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

client.on("ready", (c) => {
  console.log(`${c.user.tag} is online.`);
});
client.on("messageCreate", (message) => {
  if (message.author.bot) {
    return;
  }
  console.log(message.content);
  if ((message.content === "hello", "Hello", "hi","Hi","Hola", "hola")) {
    message.reply("HEY!");
  }
});


client.login(process.env.TOKEN);

