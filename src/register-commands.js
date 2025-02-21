require("dotenv").config();
const { REST, Routes } = require("discord.js");

const commands = [
  {
    name: "hey",
    description: "replies with hey",
  },
];
const rest = new REST({ version: "10" }).setToken(process.env.token);

(async () => {
    try {
      console.log("registering slash commands...");
      await rest.put(Routes.applicationGuildCommands(process.env.Guild_Id,process.env.Client_Id),
      {
        body: commands,
      });
      console.log("Slash commands were registered successfully!");
    } catch (error) {
      console.log(`there was an error: ${error}`);
    };
    
});
  
