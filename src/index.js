require("dotenv").config();
const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } = require("discord.js");
const { createAudioPlayer, createAudioResource, joinVoiceChannel, getVoiceConnection, AudioPlayerStatus } = require("@discordjs/voice");
const fetch = require("node-fetch");
const playdl = require("play-dl");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.MessageContent,
  ],
});

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;

const player = createAudioPlayer();
let queue = [];


client.once("ready", () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

// Slash Commands
const commands = [
  new SlashCommandBuilder().setName("hey").setDescription("Replies with hey"),
  new SlashCommandBuilder().setName("ping").setDescription("Ping the bot"),
  new SlashCommandBuilder()
    .setName("add")
    .setDescription("Add two numbers")
    .addNumberOption(option => option.setName("first-number").setDescription("First number").setRequired(true))
    .addNumberOption(option => option.setName("second-number").setDescription("Second number").setRequired(true)),
  new SlashCommandBuilder().setName("embed").setDescription("Sends an embed message"),
  new SlashCommandBuilder()
    .setName("play")
    .setDescription("Play music from a YouTube URL")
    .addStringOption(option => option.setName("url").setDescription("YouTube URL").setRequired(true)),
  new SlashCommandBuilder().setName("pause").setDescription("Pause the music"),
  new SlashCommandBuilder().setName("skip").setDescription("Skip the current song"),
  new SlashCommandBuilder().setName("stop").setDescription("Stop the music and leave the channel"),
];

const rest = new REST({ version: "10" }).setToken(TOKEN);
(async () => {
  try {
    console.log("Registering commands...");
    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: commands });
    console.log("✅ Slash commands registered successfully!");
  } catch (error) {
    console.error("❌ Error registering commands:", error);
  }
})();

// Function to play the next song in the queue
async function playNextSong(guildId) {
  const queue = queues.get(guildId);
  if (!queue || queue.songs.length === 0) {
      queue?.connection.destroy();
      queues.delete(guildId);
      return;
  }

  const song = queue.songs.shift();
  
  try {
// Use your extracted cookies
playdl.setToken({
    youtube: {
        cookie: "VISITOR_INFO1_LIVE=your_cookie_here; YSC=your_cookie_here",
    }
});

      queue.player.play(resource); // Play the stream

      queue.player.on(AudioPlayerStatus.Idle, () => {
          playNextSong(guildId); // Play next song when finished
      });

      queue.player.on("error", (error) => {
          console.error("Error playing audio:", error);
          playNextSong(guildId);
      });
  } catch (error) {
      console.error("Error fetching or playing the song:", error);
      queue.textChannel.send("⚠️ Error playing the song. Skipping...");
      playNextSong(guildId);
  }
}

// Register slash commands
const command = [
  new SlashCommandBuilder()
    .setName("play")
    .setDescription("Play music from a YouTube URL (optional)")
    .addStringOption(option =>
      option.setName("url").setDescription("YouTube URL (optional)").setRequired(false)
    ),
  new SlashCommandBuilder().setName("pause").setDescription("Pause the music"),
  new SlashCommandBuilder().setName("skip").setDescription("Skip the current song"),
  new SlashCommandBuilder().setName("stop").setDescription("Stop the music and leave the channel"),
];


const { clientId, guildId,} = process.env;

// Interaction handler for commands
client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) return;

  try {
    await interaction.deferReply(); // Defer response to avoid timeout

    switch (interaction.commandName) {
      case "play":
        if (!interaction.member.voice.channel) {
          return interaction.editReply("❌ You must be in a voice channel.");
        }

        const url = interaction.options.getString("url");

        if (!url) {
          return interaction.editReply("❌ Please provide a YouTube link.");
        }

        queue.push(url);

        let connection = getVoiceConnection(interaction.guild.id);
        if (!connection) {
          connection = joinVoiceChannel({
            channelId: interaction.member.voice.channelId,
            guildId: interaction.guild.id,
            adapterCreator: interaction.guild.voiceAdapterCreator,
          });
          connection.subscribe(player);
        }

        if (player.state.status !== AudioPlayerStatus.Playing) {
          playNextSong(interaction);
        } else {
          await interaction.editReply(`🎵 Added to queue: ${url}`);
        }
        break;

      case "pause":
        player.pause();
        await interaction.editReply("⏸️ Music paused.");
        break;

      case "skip":
        playNextSong(interaction);
        await interaction.editReply("⏭️ Skipping to the next song.");
        break;

      case "stop":
        queue = [];
        getVoiceConnection(interaction.guild.id)?.destroy();
        await interaction.editReply("⏹️ Music stopped and bot left the channel.");
        break;
    }
  } catch (error) {
    console.error("Error processing command:", error);
    await interaction.editReply("⚠️ An error occurred.");
  }
});

// AI Chat Response
client.on("messageCreate", async message => {
  if (message.author.bot) return;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "sophosympatheia/rogue-rose-103b-v0.2:free",
        messages: [{ role: "user", content: message.content }],
      }),
    });

    const data = await response.json();
    if (data.choices && data.choices.length > 0) {
      await message.reply(data.choices[0].message.content);
    } else {
      await message.reply("❌ Sorry, I couldn't generate a response.");
    }
  } catch (error) {
    console.error("❌ Error fetching AI response:", error);
    await message.reply("⚠️ An error occurred while processing your request.");
  }
});

client.login(TOKEN);
