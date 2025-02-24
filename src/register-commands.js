const { REST, Routes, SlashCommandBuilder } = require("discord.js");
require("dotenv").config();

const commands = [
  new SlashCommandBuilder()
    .setName("add")
    .setDescription("Adds two numbers")
    .addNumberOption((option) =>
      option.setName("first-number")
        .setDescription("The first number")
        .setRequired(true)
    )
    .addNumberOption((option) =>
      option.setName("second-number")
        .setDescription("The second number")
        .setRequired(true)
    )
].map(command => command.toJSON()); // Convert to JSON for Discord API

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log("Registering slash commands...");
    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID
      ),
      { body: commands }
    );
    console.log("✅ Slash commands were registered successfully!");
  } catch (error) {
    console.error(`❌ Error registering commands: ${error}`);
  }
})();
