require("dotenv").config();
const { Client, IntentsBitField, EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const fetch = globalThis.fetch; // Ensure fetch is available

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

client.once("ready", () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

// Register slash commands in Discord
const commands = [
  new SlashCommandBuilder().setName("hey").setDescription("Replies with hey"),
  new SlashCommandBuilder().setName("ping").setDescription("Ping the bot"),
  new SlashCommandBuilder()
    .setName("add")
    .setDescription("Add two numbers")
    .addNumberOption(option =>
      option.setName("first-number").setDescription("First number").setRequired(true)
    )
    .addNumberOption(option =>
      option.setName("second-number").setDescription("Second number").setRequired(true)
    ),
  new SlashCommandBuilder()
    .setName("embed")
    .setDescription("Sends an embed message"),
  new SlashCommandBuilder()
    .setName("bible")
    .setDescription("Get a Bible verse")
    .addStringOption(option =>
      option.setName("verse").setDescription("Verse reference (e.g. John 3:16)").setRequired(true)
    ),
  new SlashCommandBuilder().setName("play").setDescription("Play music from a YouTube URL").addStringOption(option => option.setName('url').setDescription('YouTube URL').setRequired(true)),
  new SlashCommandBuilder().setName("pause").setDescription("Pause the music"),
  new SlashCommandBuilder().setName("skip").setDescription("Skip the current song"),
  new SlashCommandBuilder().setName("stop").setDescription("Stop the music and leave the channel"),
];

const { REST, Routes } = require("discord.js");
const { clientId, guildId } = process.env;  // Add clientId and guildId to your .env file
const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log("Registering commands...");
    await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      { body: commands },
    );
    console.log("Slash commands were registered successfully!");
  } catch (error) {
    console.error("Error registering commands:", error);
  }
})();

// Event listener for interactions
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return; // Only process slash commands

  try {
    // Command: hey
    if (interaction.commandName === "hey") {
      await interaction.reply("HEY!!");
    }

    // Command: ping
    if (interaction.commandName === "ping") {
      const ping = client.ws.ping;
      await interaction.reply(`Pong! Latency is ${ping}ms.`);
    }

    // Command: add
    if (interaction.commandName === "add") {
      const num1 = interaction.options.get("first-number").value;
      const num2 = interaction.options.get("second-number").value;
      await interaction.reply(`The sum is ${num1 + num2}`);
    }

    // Command: embed
    if (interaction.commandName === "embed") {
      const embed = new EmbedBuilder()
        .setTitle("Test-Bot")
        .setDescription("A bot used by me to make commands")
        .setColor("Random")
        .setImage("https://static1.thegamerimages.com/wordpress/wp-content/uploads/2024/09/the-multiverse-by-coupleofkooks-1.jpg")
        .setFooter({text:'Made as a project', iconURL:'https://static.wixstatic.com/media/b34289_0b00d544f6504279b491b36616f2efe5~mv2_d_2040_1360_s_2.jpg/v1/fill/w_1000,h_667,al_c,q_85,usm_0.66_1.00_0.01/b34289_0b00d544f6504279b491b36616f2efe5~mv2_d_2040_1360_s_2.jpg'} )
        .addFields(
          { name: "Background", value: "The world is a sphere!!", inline: true },
          { name: "Character", value: "It is also flat!!", inline: true }
        );
      await interaction.reply({ embeds: [embed] });
    }
    
    // Command: bible
    if (interaction.commandName === "bible") {
      const verse = interaction.options.getString("verse");
      const response = await fetch(`https://bible-api.com/${encodeURIComponent(verse)}`);
      const data = await response.json();
      
      if (data.text) {
        const embed = new EmbedBuilder()
          .setTitle(`📖 ${verse}`)
          .setDescription(data.text)
          .setColor("Random")
          .setImage("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0Pp0QC7yS6fTgSzivXVfdWMxdD6jNGXMX9A&s")
          .setFooter({ text: "Holy Bible" });

        await interaction.reply({ embeds: [embed] });
      } else {
        await interaction.reply("❌ Verse not found. Please try again.");
      }
    }

  } catch (error) {
    console.error("Error processing command:", error);
    await interaction.reply("⚠️ An error occurred while processing your request.");
  }
});

// AI chat handler (for non-command messages)
client.on("messageCreate", async (message) => {
  if (message.author.bot) return; // Ignore bot messages

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.0-flash-lite-preview-02-05:free", // Your model here
        messages: [{ role: "user", content: message.content }],
      }),
    });

    const data = await response.json();

    if (data.choices && data.choices.length > 0) {
      const aiResponse = data.choices[0].message.content;
      await message.reply(aiResponse); // Send AI response to Discord chat
    } else {
      await message.reply("❌ Sorry, I couldn't generate a response.");
    }
  } catch (error) {
    console.error("Error fetching AI response:", error);
    await message.reply("⚠️ An error occurred while processing your request.");
  }
});

client.login(process.env.TOKEN);
