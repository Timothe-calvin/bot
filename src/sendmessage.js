require(`dotenv`).config();

const { Client, IntentsBitField, EmbedBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

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

const roles = [
    {
        id: 'add role id here',
        label: 'Red'
    },
    {
        id: 'add role id here',
        label: 'green'
    },
    {
        id: 'add role id here',
        label: 'blue'
    },
]

client.on("ready", async (c) => {
 try{
const channel = await client.channel.cache.get('')
if(!channel) return;

roles.forEach((role) => {
    ActionRow.components.push(
        new ButtonBuilder().setCustomId(role.id).setLabel(role.label).setStyle(ButtonStyle.Primary)
    )
    channel.send({
        content: 'claim or remove a role below',
        components: [row],
    })
})
 }catch(error){
    console.log(error);}
});
client.login(process.env.TOKEN);
