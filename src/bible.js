const { REST, Routes, SlashCommandBuilder } = require("discord.js");
require("dotenv").config();

const commands = [
  new SlashCommandBuilder()
    .setName("bible")
    .setDescription("Get a Bible verse")
    .addStringOption(option =>
      option
        .setName("verse")
        .setDescription("Enter a verse (e.g. John 3:16)")
        .setRequired(true)
    )
].map(command => command.toJSON());

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log("Registering slash commands...");
    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });
    console.log("✅ Slash commands registered!");
  } catch (error) {
    console.error("Error registering commands:", error);
  }
})();