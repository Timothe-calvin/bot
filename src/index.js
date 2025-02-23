require("dotenv").config();
const {
  Client,
  IntentsBitField,
  EmbedBuilder,
  SlashCommandBuilder,
} = require("discord.js");

const fetch = globalThis.fetch; // Ensure fetch is available

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

client.on("interactionCreate", (interaction) => {
  if (!interaction.isChatInputCommand()) return; // Only process slash commands

  // Handle each command
  if (interaction.commandName === "hey") {
    interaction.reply("HEY!!");
  }
  if (interaction.commandName === "ping") {
    interaction.reply("pong!");
  }
  if (interaction.commandName === "add") {
    const num1 = interaction.options.get("first-number").value;
    const num2 = interaction.options.get("second-number").value;
    interaction.reply(`the sum is ${num1 + num2}`);
  }
  if (interaction.commandName === "embed") {
    const embed = new EmbedBuilder()
      .setTitle("Test-Bot")
      .setDescription("A bot used by me to make commands")
      .setColor("Random") 
      .setImage("https://static.wixstatic.com/media/b34289_0b00d544f6504279b491b36616f2efe5~mv2_d_2040_1360_s_2.jpg/v1/fill/w_1000,h_667,al_c,q_85,usm_0.66_1.00_0.01/b34289_0b00d544f6504279b491b36616f2efe5~mv2_d_2040_1360_s_2.jpg")
      .addFields(
        { name: "Background", value: "The world is a sphere!!", inline: true },
        { name: "Character", value: "It is also flat!!", inline: true },
     
      );
    interaction.reply({ embeds: [embed] });
  }
});

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

client.once("ready", () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return; // Ignore bot messages

  try {
    // Ensure no multiple replies: Track if a reply has been sent
    if (message.replied) {
      console.log("Message already replied to, skipping.");
      return;
    }

    // Fetch AI response from OpenRouter
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.0-flash-lite-preview-02-05:free", // Use your chosen model here
          messages: [{ role: "user", content: message.content }],
        }),
      }
    );

    // Parse the response
    const data = await response.json();

    // Check if the AI response is valid
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

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

 const fetch = globalThis.fetch;

  if (interaction.commandName === "bible") {
    const verse = interaction.options.getString("verse");
   
    try {
      // Fetch verse from Bible API
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
    } catch (error) {
      console.error("Error fetching Bible verse:", error);
      await interaction.reply("⚠️ An error occurred while fetching the verse.");
    }
  }
});

client.login(process.env.TOKEN);
