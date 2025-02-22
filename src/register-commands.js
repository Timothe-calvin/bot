require('dotenv').config();
const { REST, Routes } = require('discord.js');

const commands = [
  {
    name: "hey",
    description: "replies with hey",
  },
  {
    name: "ping",
    description: "Pong",
  },
];
const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
    try {
      console.log('registering slash commands...');
    await rest.put(
        Routes.applicationGuildCommands(
        process.env.GUILD_ID,
        process.env.CLIENT_ID),
      { body: commands }
    )
      console.log("Slash commands were registered successfully!");
    } catch (error) {
      console.log(`there was an error: ${error}`);
    }
    
})();
  
