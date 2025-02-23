const { REST, Routes, SlashCommandBuilder } = require("discord.js");
require("dotenv").config();

const commands = [
    new SlashCommandBuilder()
        .setName("play")
        .setDescription("Plays a YouTube video audio")
        .addStringOption(option =>
            option.setName("url")
                .setDescription("YouTube video URL")
                .setRequired(true)
        ),
    new SlashCommandBuilder().setName("stop").setDescription("Stops the music"),
    new SlashCommandBuilder().setName("skip").setDescription("Skips the current song"),
    new SlashCommandBuilder().setName("pause").setDescription("Pauses the music"),
    new SlashCommandBuilder().setName("resume").setDescription("Resumes paused music"),
    new SlashCommandBuilder().setName("queue").setDescription("Shows the current music queue"),
].map(command => command.toJSON());

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log("🔃 Registering slash commands...");
        await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });
        console.log("✅ Slash commands registered!");
    } catch (error) {
        console.error("❌ Error registering commands:", error);
    }
})();