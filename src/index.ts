import path from 'path';
const pathDotEnv = path.join(__dirname, '../../.env');
require('dotenv').config();

import { EmbedBuilder, Message } from 'discord.js';
import { JoultsMusicClient } from './Structures/JoultsMusicClient';

export const client = new JoultsMusicClient();
client.start(process.env.TOKEN);

let storedNPMsg: Message;

client.distube
    .on('playSong', async (queue, song) => {
        const embed = new EmbedBuilder()
            .setTitle(`**Now Playing**`)
            .setColor(client.colour)
            .setDescription(`[${song.name}](${song.url}) [${song.user}]`);
        const channel = queue.textChannel;
        storedNPMsg = await channel.send({ embeds: [embed] });
    })
    .on('finishSong', async () => {
        try {
            if (storedNPMsg) await storedNPMsg.delete();
        } catch (err) {
            console.log(err);
        }
    })
    .on('finish', async (queue) => {
        try {
            const channel = queue.textChannel;
            const embed = new EmbedBuilder()
                .setColor(client.colour)
                .setDescription(`The queue has ended.`);
            await channel.send({ embeds: [embed] });
            if (storedNPMsg) await storedNPMsg.delete();
        } catch (err) {
            console.log(err);
        }
    })
    .on('addSong', async (queue, song) => {
        try {
            const channel = queue.textChannel;
            const embed = new EmbedBuilder()
                .setColor(client.colour)
                .setDescription(
                    `Queued [${song.name}](${song.url}) [${song.user}]`
                );
            return await channel.send({ embeds: [embed] });
        } catch (err) {
            console.log(err);
        }
    })
    .on('addList', async (queue, playlist) => {
        try {
            const channel = queue.textChannel;
            const embed = new EmbedBuilder()
                .setColor(client.colour)
                .setDescription(
                    `Queued ${playlist.songs.length} songs from playlist: ${playlist.name}. [${playlist.songs[0].user}]`
                );
            return await channel.send({ embeds: [embed] });
        } catch (err) {
            console.log(err);
        }
    })
    .on('error', async (channel, error) => {
        try {
            const embed = new EmbedBuilder()
                .setColor(client.colour)
                .setDescription(`${client.emote.ERROR} | ${error}`);
            if (channel) channel.send({ embeds: [embed] });
        } catch (err) {
            console.log(err);
        }
    });

process.on('exit', () => client.destroy());
process.on('kill', () => client.destroy());
process.on('SIGINT', () => {
    process.exit(1);
});
