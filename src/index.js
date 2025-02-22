require("dotenv").config();
const { Client, IntentsBitField, EmbedBuilder,GatewayIntentBits} = require("discord.js");
const { OpenAI, } = require('openai');

   const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });


const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ]
});

// client.on("ready", (c) => {
//   console.log(`${c.user.tag} is online.`);
// });

client.on("interactionCreate", (interaction) => {
  if (!interaction.isChatInputCommand()) return;

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
      .addFields(
        {
          name: "Background",
          value: "The world is a sphere!!",
          inline: true,
        },
        {
          name: "Character",
          value: "It is also flat!!",
          inline: true,
        }
      );

    interaction.reply({ embeds: [embed] });
  }
});

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

client.once('ready', () => {
    console.log(`✅ Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return; // Ignore bot messages

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "mixtral-8x7b-instruct",
                messages: [{ role: "user", content: message.content }]
            })
        });

        const data = await response.json();
        if (data.choices && data.choices.length > 0) {
            message.reply(data.choices[0].message.content);
        } else {
            message.reply("❌ Sorry, I couldn't generate a response.");
        }
    } catch (error) {
        console.error("Error fetching AI response:", error);
        message.reply("⚠️ An error occurred while processing your request.");
    }
});


const fetch = globalThis.fetch; // Ensure fetch is available

client.on('messageCreate', async (message) => {
  if (message.author.bot) return; // Ignore bot messages

  try {
      // Ensure no multiple replies: Track if a reply has been sent
      if (message.replied) {
          console.log("Message already replied to, skipping.");
          return;
      }

      // Fetch AI response from OpenRouter
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
              "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
              "Content-Type": "application/json"
          },
          body: JSON.stringify({
              model: "google/gemini-2.0-flash-lite-preview-02-05:free",
              messages: [{ role: "user", content: message.content }]
          })
      });

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

client.login(process.env.TOKEN);

