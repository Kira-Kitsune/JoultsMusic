import path from 'path';
const pathDotEnv = path.join(__dirname, '../../.env');
require('dotenv').config({ path: pathDotEnv });

import { EmbedBuilder, Message } from 'discord.js';
import { JoultsMusicClient } from './Structures/JoultsMusicClient';

export const client = new JoultsMusicClient();

client.start(process.env.TOKEN);

let storedNPMsg: Message;

client.distube
    .on('playSong', async ({ textChannel }, { name, url, user }) => {
        const embed = new EmbedBuilder()
            .setTitle(`**Now Playing**`)
            .setColor(client.colour)
            .setDescription(`[${name}](${url}) [${user}]`);
        storedNPMsg = await textChannel.send({ embeds: [embed] });
    })
    .on('finishSong', async () => {
        try {
            if (storedNPMsg) await storedNPMsg.delete();
        } catch (err) {
            console.error(err);
        }
    })
    .on('finish', async ({ textChannel }) => {
        try {
            const embed = new EmbedBuilder()
                .setColor(client.colour)
                .setDescription(`The queue has ended.`);
            await textChannel.send({ embeds: [embed] });
            if (storedNPMsg) await storedNPMsg.delete();
        } catch (err) {
            console.error(err);
        }
    })
    .on('addSong', async ({ textChannel }, { name, url, user }) => {
        try {
            const embed = new EmbedBuilder()
                .setColor(client.colour)
                .setDescription(`Queued [${name}](${url}) [${user}]`);
            return await textChannel.send({ embeds: [embed] });
        } catch (err) {
            console.error(err);
        }
    })
    .on('addList', async ({ textChannel }, { name, songs }) => {
        try {
            const embed = new EmbedBuilder()
                .setColor(client.colour)
                .setDescription(
                    `Queued ${songs.length} songs from playlist: ${name}. [${songs[0].user}]`
                );
            return await textChannel.send({ embeds: [embed] });
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
            console.error(err);
        }
    });

process.on('exit', () => client.destroy());
process.on('kill', () => client.destroy());
process.on('SIGINT', () => {
    process.exit(1);
});
