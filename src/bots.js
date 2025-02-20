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

client.on("messageCreate", (message) => {
  console.log(message.content);
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
  }
});
try {
  if (!interaction.isButton()) return;
  await interaction.deferReply({ ephemeral: true });
  {
    const role = interaction.guild.oles.cache.get(interaction.customId);
    if (!role) {
      interaction.reply({
        content: "I couldn't find that role",
      });
      return;
    }

    const hasRole = interaction.member.roles.cache.has(role.id);

    if (hasRole) {
      await interaction.member.roles.remove(role);
      await interaction.editReply(`The Role ${role} has been removed.`);
      return;
    }
  }

  await interaction.member.role.add(role);
  await interaction.editReply(`The Role ${role} has been added.`);
  return;
} catch (error) {
  console.log(error);
}
console.log(interaction);

client.login(process.env.TOKEN);
