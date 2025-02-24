// const { Client, IntentsBitField, SlashCommandBuilder } = require("discord.js");
// const { createAudioPlayer, createAudioResource, joinVoiceChannel, getVoiceConnection, AudioPlayerStatus } = require("@discordjs/voice");
// const playdl = require("play-dl");

// const client = new Client({
//   intents: [
//     IntentsBitField.Flags.Guilds,
//     IntentsBitField.Flags.GuildVoiceStates, // Required for voice channel interaction
//     IntentsBitField.Flags.GuildMessages,
//   ],
// });

// const player = createAudioPlayer();
// let queue = [];

// // Function to play the next song in the queue
// async function playNextSong(interaction) {
//   if (queue.length === 0) {
//     interaction.followUp("🎵 Queue is empty. Leaving voice channel.");
//     getVoiceConnection(interaction.guild.id)?.destroy();
//     return;
//   }

//   const url = queue.shift();
//   try {
//     const stream = await playdl.stream(url);
//     const resource = createAudioResource(stream.stream, { inputType: stream.type });

//     player.play(resource);
//     interaction.followUp(`🎶 Now playing: ${url}`);
//   } catch (error) {
//     console.error("Error playing YouTube audio:", error);
//     interaction.followUp("❌ Error playing the requested song.");
//     playNextSong(interaction); // Try the next song if the current one fails
//   }
// }

// // Handle bot login
// client.once("ready", () => {
//   console.log(`✅ Logged in as ${client.user.tag}`);
// });

// // Register slash commands
// const commands = [
//   new SlashCommandBuilder()
//     .setName("play")
//     .setDescription("Play music from a YouTube URL (optional)")
//     .addStringOption(option =>
//       option.setName("url").setDescription("YouTube URL (optional)").setRequired(false)
//     ),
//   new SlashCommandBuilder().setName("pause").setDescription("Pause the music"),
//   new SlashCommandBuilder().setName("skip").setDescription("Skip the current song"),
//   new SlashCommandBuilder().setName("stop").setDescription("Stop the music and leave the channel"),
// ];

// const { REST, Routes } = require("discord.js");
// require("dotenv").config();
// const { clientId, guildId, TOKEN } = process.env;
// const rest = new REST({ version: "10" }).setToken(TOKEN);

// (async () => {
//   try {
//     console.log("Registering commands...");
//     await rest.put(
//       Routes.applicationGuildCommands(clientId, guildId),
//       { body: commands }
//     );
//     console.log("Slash commands registered successfully!");
//   } catch (error) {
//     console.error("Error registering commands:", error);
//   }
// })();

// // Interaction handler for commands
// client.on("interactionCreate", async interaction => {
//   if (!interaction.isChatInputCommand()) return;

//   try {
//     await interaction.deferReply(); // Defer response to avoid timeout

//     switch (interaction.commandName) {
//       case "play":
//         if (!interaction.member.voice.channel) {
//           return interaction.editReply("❌ You must be in a voice channel.");
//         }

//         const url = interaction.options.getString("url");

//         if (!url) {
//           return interaction.editReply("❌ Please provide a YouTube link.");
//         }

//         queue.push(url);

//         let connection = getVoiceConnection(interaction.guild.id);
//         if (!connection) {
//           connection = joinVoiceChannel({
//             channelId: interaction.member.voice.channelId,
//             guildId: interaction.guild.id,
//             adapterCreator: interaction.guild.voiceAdapterCreator,
//           });
//           connection.subscribe(player);
//         }

//         if (player.state.status !== AudioPlayerStatus.Playing) {
//           playNextSong(interaction);
//         } else {
//           await interaction.editReply(`🎵 Added to queue: ${url}`);
//         }
//         break;

//       case "pause":
//         player.pause();
//         await interaction.editReply("⏸️ Music paused.");
//         break;

//       case "skip":
//         playNextSong(interaction);
//         await interaction.editReply("⏭️ Skipping to the next song.");
//         break;

//       case "stop":
//         queue = [];
//         getVoiceConnection(interaction.guild.id)?.destroy();
//         await interaction.editReply("⏹️ Music stopped and bot left the channel.");
//         break;
//     }
//   } catch (error) {
//     console.error("Error processing command:", error);
//     await interaction.editReply("⚠️ An error occurred.");
//   }
// });

// // Bot login
// client.login(TOKEN);
