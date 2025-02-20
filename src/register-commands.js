require('dotenv').config();
const { REST, Routes } = require('discord');

const commands =[
    {
        name: 'hey',
        description: 'replies with hey',
    },
];

const rest = new REST({version:'10'}).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log('registering slash commands');

        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            {body:commands}
        )
    } catch (error) {
        console.log('Slash commands were registered successfully!');
        console.log(`there was an error: ${error}`);
    }
})