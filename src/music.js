const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder, ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, VoiceConnectionStatus } = require('@discordjs/voice');
const ytdl = require('ytdl-core');
require("dotenv").config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],
});

// Music-related data
const player = createAudioPlayer();
const connections = new Map();

// Register Commands
const commands = [
  new SlashCommandBuilder().setName('play').setDescription('Play a song from YouTube').addStringOption(option => option.setName('url').setDescription('YouTube URL').setRequired(true)),
  new SlashCommandBuilder().setName('pause').setDescription('Pause the currently playing song'),
  new SlashCommandBuilder().setName('resume').setDescription('Resume the currently paused song'),
  new SlashCommandBuilder().setName('skip').setDescription('Skip the currently playing song'),
  new SlashCommandBuilder().setName('stop').setDescription('Stop the music and disconnect from the voice channel'),
  new SlashCommandBuilder().setName('ping').setDescription('Check bot latency'),
];

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log("Registering slash commands...");
    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
      { body: commands.map(command => command.toJSON()) }
    );
    console.log("Slash commands registered!");
  } catch (error) {
    console.log(`Error registering commands: ${error}`);
  }
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  // Music Command Logic
  const { commandName } = interaction;
  const voiceChannel = interaction.member.voice.channel;

  if (commandName === 'ping') {
    const ping = client.ws.ping;
    return interaction.reply(`Pong! Latency is ${ping}ms.`);
  }

  // Ensure the user is in a voice channel
  if (!voiceChannel) {
    return interaction.reply("❌ You need to join a voice channel first!");
  }

  const guildId = interaction.guild.id;

  // Play Command
  if (commandName === 'play') {
    const url = interaction.options.getString('url');
    if (!ytdl.validateURL(url)) {
      return interaction.reply("❌ Please provide a valid YouTube URL.");
    }

    try {
      // Join the voice channel
      let connection = connections.get(guildId);
      if (!connection) {
        connection = joinVoiceChannel({
          channelId: voiceChannel.id,
          guildId,
          adapterCreator: interaction.guild.voiceAdapterCreator,
        });
        connections.set(guildId, connection);
      }

      const stream = ytdl(url, { filter: 'audioonly' });
      const resource = createAudioResource(stream);
      
      // Play the song
      player.play(resource);
      connection.subscribe(player);

      player.on(AudioPlayerStatus.Idle, () => {
        connection.destroy(); // Disconnect when the song ends
        connections.delete(guildId);
      });

      return interaction.reply(`🎶 Now playing: ${url}`);
    } catch (error) {
      console.error(error);
      return interaction.reply("❌ There was an error while trying to play the song.");
    }
  }

  // Pause Command
  if (commandName === 'pause') {
    if (player.state.status === AudioPlayerStatus.Playing) {
      player.pause();
      return interaction.reply("⏸️ Music paused.");
    } else {
      return interaction.reply("❌ No music is currently playing.");
    }
  }

  // Resume Command
  if (commandName === 'resume') {
    if (player.state.status === AudioPlayerStatus.Paused) {
      player.unpause();
      return interaction.reply("▶️ Music resumed.");
    } else {
      return interaction.reply("❌ Music is not paused.");
    }
  }

  // Skip Command
  if (commandName === 'skip') {
    if (player.state.status === AudioPlayerStatus.Playing) {
      player.stop();
      return interaction.reply("⏩ Skipped the song.");
    } else {
      return interaction.reply("❌ No music is currently playing.");
    }
  }

  // Stop Command (Leave Voice Channel)
  if (commandName === 'stop') {
    if (connections.has(guildId)) {
      const connection = connections.get(guildId);
      connection.destroy();
      connections.delete(guildId);
      player.stop();
      return interaction.reply("🛑 Stopped the music and left the voice channel.");
    } else {
      return interaction.reply("❌ I'm not connected to any voice channel.");
    }
  }
});

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.login(process.env.TOKEN);
