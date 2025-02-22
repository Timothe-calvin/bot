const { REST, Routes, ApplicationCommandOptionType } = require("discord.js");
require("dotenv").config();

const Commands = [
  {
    name: "hey",
    description: "replies with hey",
  },
  {
    name: "ping",
    description: "Pong",
  },
   {
    name: "add",
    description: "add 2 numbers",
    options:[
      {
        name:'first-number',
        description:'The first number',
        type:ApplicationCommandOptionType.Number,
        required: true,
      },
      {
        name:'second-number',
        description:'The second number',
        type:ApplicationCommandOptionType.Number,
        required: true,
      }
    
    ],
   }
];

 


const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log("registering slash commands...");
    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID
      ),
      { body: Commands }
    );
    console.log(`Slash commands were registered successfully!`);
  } catch (error) {
    console.log(`there was an error: ${error}`);
  }
})();
