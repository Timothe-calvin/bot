require('dotenv').config();
const { Client, IntentsBitField } = require('discord.js');

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
client.on('interactionCreate', (interaction)=>{
	if (!interaction.isChatInputCommand()) return;

	if (interaction.commandName === 'hey') {
		interaction.reply('HEY')
	};
	if (interaction.commandName === 'ping') {
		interaction.reply('pong!')
	};
});

client.login(process.env.TOKEN);

