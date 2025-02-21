require(`dotenv`).config();
const { REST, Routes, ApplicationCommandOptionType } = require("discord");

const commands = [
  {
    name: 'embed',
    description:'sends an embed',

    name: "add",
    description: "adds two numbers",
    options: [
      {
        name: "first-number",
        description: "the first number",
        type: ApplicationCommandOptionType.Number,
        required: true,
        choices: [
          {
            name: "one",
            value: 1,
          },

          {
            name: "two",
            value: 2,
          },
          {
            name: "three",
            value: 3,
          },
        ],
      },
      {
        name: "second-number",
        description: "the second number",
        type: ApplicationCommandOptionType.Number,
        required: true,
      },
    ],
  },
];

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

async () => {
  try {
    console.log("registering slash commands");

    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID
      ),
      { body: commands }
    );
  } catch (error) {
    console.log("Slash commands were registered successfully!");
    console.log(`there was an error: ${error}`);
  }
};

client.login('MTM0MTc5MTA2MzMzMzE0Njc2NQ.GWnPCY.66DuNhS11kHfk8VigPWW7tgLCbo0k7yssOr7rM');