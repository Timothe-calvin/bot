
require(`dotenv`).config();

const { Client, IntentsBitField, EmbedBuilder } = require("discord.js");

const myIntents = new IntentsBitField();
myIntents.add(
  IntentsBitField.Flags.GuildPresences,
  IntentsBitField.Flags.GuildMembers
);

const client = new Client({ intents: myIntents });

const otherIntents = new IntentsBitField([
  IntentsBitField.Flags.Guilds,
  IntentsBitField.Flags.DirectMessages,
]);
otherIntents.remove([IntentsBitField.Flags.DirectMessages]);

client.on("ready", (c) => {
  console.log(` ${c.user.tag} is online.`);
});

client.on("interactionCreate", async (interaction) => {
    if (!InteractionCallback.isChatInputCommand()) return;
    if (interaction.commandName === "add") {
      const num1 = interaction.options.get("first-number").value;
      const num2 = interaction.options.get("second-number").value;
    
interaction.reply(`the sum is ${num1 + num2}`);
    if (interaction.commandName === "embed") {
      const embed = new EmbedBuilder()
        .setTitle("embed title")
        .setDescription("This is an embed description")
        .setColor("random")
        .addFields({ name: fieldTitle, value: embedValue });

      interaction.reply({ embeds: [embed] });
    }
  }})
    client.login('MTM0MTc5MTA2MzMzMzE0Njc2NQ.GWnPCY.66DuNhS11kHfk8VigPWW7tgLCbo0k7yssOr7rM');