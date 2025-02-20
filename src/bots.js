const { Client, IntentsBitField } = require('discord.js');

const myIntents = new IntentsBitField();
myIntents.add(IntentsBitField.Flags.GuildPresences, IntentsBitField.Flags.GuildMembers);

const client = new Client({ intents: myIntents });

// other examples:
const otherIntents = new IntentsBitField([IntentsBitField.Flags.Guilds, IntentsBitField.Flags.DirectMessages]);
otherIntents.remove([IntentsBitField.Flags.DirectMessages]);


client.login(
  "MTM0MTc5MTA2MzMzMzE0Njc2NQ.Gjk0ma.QHboRTNEWTLBF-ZgzSq8bB-r743aiGpYlFUGEs"
)