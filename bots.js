const Discord = require("discord.js");

const client = new Discord.Client({
  intents: ["GUILDS", "GUILDS_MESSAGES", "GUILD_MEMBERS", "MESSAGE_CONTENT"],
  partials: ["CHANNEL", "MESSAGE"],
});
// remember to change bot token after uploading
// token can be grabbed from bot creation under bot tag (use reset token to get code have to refresh it each time.)
const token =
  "MTM0MTc5MTA2MzMzMzE0Njc2NQ.GTUHX0.Hu2OHrTYbfnr3DRHH-jJ_ZUpT_cFRquixCEmuI";

client.on("ready", async () => {
  console.log(`client has been initiated! ${client.user.username}`);

  client.guilds.cache.forEach((guild) => {
    setupSlashCommands(client, guild.id);
  });
});

client.on("messageCreate", async (message) => {
  if (message.content.toLowerCase() === "test") {
    message.reply("test successful").catch((err) => console.error(err));
  }
});
// ensure to click bot and administrator when making discord bot
function setupSlashCommands(client, guildId) {
  const commands = [
    {
      name: "mimic",
      description: "replies with whatever you said",
      options: [
        {
          name: "say",
          description: "the thing you want the bot to say",
          type: "string",
          required: true,
          //   max length for bots code so discord and bot don't break
          maxLength: 2000,
        },
      ],
    },
  ];

  const guild = client.guilds.cache.get(guildId);
  if (guild) {
    console.error(`Guild with the ${guild} was not found.`);

    guild.commands.set(commands).catch((error) => {
      console.error(
        `error setting commands for guild ${guild.name} (${guild.id})`,
        error
      );
    });
    client.on("interactionCreate", async (Interactions) => {
      const mimic = Interactions.options.getString("say");

      await Interactions.reply(`You said:\n${mimic}`);
    });
  }
}

client.login(token);
