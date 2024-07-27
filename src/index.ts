import path from "node:path";
const pathDotEnv = path.join(__dirname, "../../.env");
const TARGET = process.env.npm_lifecycle_event || "prod";

switch (TARGET) {
	case "dev":
		require("dotenv").config();
		break;
	default:
		require("dotenv").config({ path: pathDotEnv });
		break;
}

import { EmbedBuilder, type Message } from "discord.js";
import { JoultsMusicClient } from "./Structures/JoultsMusicClient";
import { Events } from "distube";

export const client = new JoultsMusicClient();
client.start(process.env.TOKEN);

let storedNPMsg: Message;

/*
    ERROR = "error",
    ADD_LIST = "addList",
    ADD_SONG = "addSong",
    PLAY_SONG = "playSong",
    FINISH_SONG = "finishSong",
    EMPTY = "empty",
    FINISH = "finish",
    INIT_QUEUE = "initQueue",
    NO_RELATED = "noRelated",
    DISCONNECT = "disconnect",
    DELETE_QUEUE = "deleteQueue",
    FFMPEG_DEBUG = "ffmpegDebug",
    DEBUG = "debug"

        [Events.ADD_LIST]: [queue: Queue, playlist: Playlist];
    [Events.ADD_SONG]: [queue: Queue, song: Song];
    [Events.DELETE_QUEUE]: [queue: Queue];
    [Events.DISCONNECT]: [queue: Queue];
    [Events.ERROR]: [error: Error, queue: Queue, song: Song | undefined];
    [Events.FFMPEG_DEBUG]: [debug: string];
    [Events.DEBUG]: [debug: string];
    [Events.FINISH]: [queue: Queue];
    [Events.FINISH_SONG]: [queue: Queue, song: Song];
    [Events.INIT_QUEUE]: [queue: Queue];
    [Events.NO_RELATED]: [queue: Queue, error: DisTubeError];
    [Events.PLAY_SONG]: [queue: Queue, song: Song];
*/

client.distube
	.on(Events.PLAY_SONG, async ({ textChannel }, { name, url, user }) => {
		const embed = new EmbedBuilder()
			.setTitle("**Now Playing**")
			.setColor(client.colour)
			.setDescription(`[${name}](${url}) [${user}]`);
		storedNPMsg = await textChannel.send({ embeds: [embed] });
	})
	.on(Events.FINISH_SONG, async () => {
		try {
			if (storedNPMsg) await storedNPMsg.delete();
		} catch (err) {
			console.error(err);
		}
	})
	.on(Events.FINISH, async ({ textChannel, voice }) => {
		try {
			const embed = new EmbedBuilder()
				.setColor(client.colour)
				.setDescription("The queue has ended.");
			await textChannel.send({ embeds: [embed] });
			if (storedNPMsg) await storedNPMsg.delete();
			voice.leave();
		} catch (err) {
			console.error(err);
		}
	})
	.on(Events.ADD_SONG, async ({ textChannel }, { name, url, user }) => {
		try {
			const embed = new EmbedBuilder()
				.setColor(client.colour)
				.setDescription(`Queued [${name}](${url}) [${user}]`);
			return await textChannel.send({ embeds: [embed] });
		} catch (err) {
			console.error(err);
		}
	})
	.on(Events.ADD_LIST, async ({ textChannel }, { name, songs }) => {
		try {
			const embed = new EmbedBuilder()
				.setColor(client.colour)
				.setDescription(
					`Queued ${songs.length} songs from playlist: ${name}. [${songs[0].user}]`,
				);
			return await textChannel.send({ embeds: [embed] });
		} catch (err) {
			console.log(err);
		}
	})
	.on(Events.ERROR, async (error, queue, _) => {
		try {
			const embed = new EmbedBuilder()
				.setColor(client.colour)
				.setDescription(`${client.emote.ERROR} | ${error}`);
			if (queue.textChannel) queue.textChannel.send({ embeds: [embed] });
		} catch (err) {
			console.error(err);
		}
	});

process.on("exit", () => client.destroy());
process.on("kill", () => client.destroy());
process.on("SIGINT", () => {
	process.exit(1);
});
