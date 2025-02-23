
const { joinVoiceChannel, createAudioPlayer, createAudioResource, getVoiceConnection, NoSubscriberBehavior } = require("@discordjs/voice");
const ytdl = require("discord-ytdl-core");

const queue = new Map(); // Server queue to manage songs

async function playSong(guildId) {
    const serverQueue = queue.get(guildId);
    if (!serverQueue || !serverQueue.songs.length) {
        queue.delete(guildId);
        return;
    }

    const song = serverQueue.songs[0];
    const stream = ytdl(song.url, { filter: "audioonly", highWaterMark: 1 << 25, quality: "highestaudio" });
    const resource = createAudioResource(stream);
    
    serverQueue.player.play(resource);
    serverQueue.connection.subscribe(serverQueue.player);

    serverQueue.player.on("idle", () => {
        serverQueue.songs.shift();
        playSong(guildId);
    });
}

async function play(interaction) {
    try {
        const url = interaction.options.getString("url");
        const voiceChannel = interaction.member.voice.channel;

        if (!voiceChannel) {
            return interaction.reply("❌ Join a voice channel first!");
        }

        await interaction.deferReply(); // Acknowledge the command

        let serverQueue = queue.get(interaction.guild.id);

        if (!serverQueue) {
            const connection = joinVoiceChannel({
                channelId: voiceChannel.id,
                guildId: interaction.guild.id,
                adapterCreator: interaction.guild.voiceAdapterCreator,
            });

            serverQueue = {
                connection,
                player: createAudioPlayer(),
                songs: [],
            };
            queue.set(interaction.guild.id, serverQueue);
        }

        serverQueue.songs.push({ url });

        if (serverQueue.songs.length === 1) {
            playSong(interaction.guild.id);
        }

        await interaction.followUp(`🎵 Added to queue: ${url}`);
    } catch (error) {
        console.error("Error in play command:", error);
        await interaction.followUp("❌ An error occurred while processing the command.");
    }
}
async function stop(interaction) {
    const serverQueue = queue.get(interaction.guild.id);
    if (!serverQueue) return interaction.reply("❌ No music is playing!");

    serverQueue.songs = [];
    serverQueue.player.stop();
    serverQueue.connection.destroy();
    queue.delete(interaction.guild.id);

    await interaction.reply("🛑 Music stopped.");
}

async function skip(interaction) {
    const serverQueue = queue.get(interaction.guild.id);
    if (!serverQueue || serverQueue.songs.length < 2) return interaction.reply("❌ No song to skip!");

    serverQueue.songs.shift();
    playSong(interaction.guild.id);

    await interaction.reply("⏭️ Skipped!");
}

async function pause(interaction) {
    const serverQueue = queue.get(interaction.guild.id);
    if (!serverQueue) return interaction.reply("❌ No music is playing!");

    serverQueue.player.pause();
    await interaction.reply("⏸️ Paused.");
}

async function resume(interaction) {
    const serverQueue = queue.get(interaction.guild.id);
    if (!serverQueue) return interaction.reply("❌ No music is playing!");

    serverQueue.player.unpause();
    await interaction.reply("▶️ Resumed.");
}

async function showQueue(interaction) {
    const serverQueue = queue.get(interaction.guild.id);
    if (!serverQueue || serverQueue.songs.length === 0) return interaction.reply("❌ No songs in queue!");

    let queueList = serverQueue.songs.map((song, i) => `${i + 1}. ${song.url}`).join("\n");
    await interaction.reply(`📜 **Queue:**\n${queueList}`);
}

module.exports = { play, stop, skip, pause, resume, showQueue };
