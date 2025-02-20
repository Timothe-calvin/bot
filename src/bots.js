const { Client, IntentsBitField } = require('discord.js');

const myIntents = new IntentsBitField();
myIntents.add(IntentsBitField.Flags.GuildPresences, IntentsBitField.Flags.GuildMembers);

const client = new Client({ intents: myIntents });

const otherIntents = new IntentsBitField([IntentsBitField.Flags.Guilds, IntentsBitField.Flags.DirectMessages]);
otherIntents.remove([IntentsBitField.Flags.DirectMessages]);

client.on('ready', (c) => {
  console.log(` ${c.user.tag} is online.`);
});

client.on('messageCreate', (message) =>{
console.log(message);
})


client.login(
  ""
)