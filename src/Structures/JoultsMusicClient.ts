import { Client, Collection, GatewayIntentBits, Partials } from "discord.js";
import { Emote } from "../Typings/Client";
import type { CommandType } from "../Typings/Command";
import Util from "./Util";
import fs from "node:fs";
import DisTube from "distube";
import { SpotifyPlugin } from "@distube/spotify";
import { SoundCloudPlugin } from "@distube/soundcloud";
import { YouTubePlugin } from "@distube/youtube";

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_SECRET_ID;
const cookiesPath = process.env.COOKIES_PATH;

export class JoultsMusicClient extends Client {
	commands: Collection<string, CommandType> = new Collection();
	utils = new Util(this);
	emote = Emote;
	owner = process.env.OWNER;
	colour = 0xffbf00;
	distube: DisTube;

	constructor() {
		super({
			intents: [
				GatewayIntentBits.Guilds,
				GatewayIntentBits.GuildMembers,
				GatewayIntentBits.GuildWebhooks,
				GatewayIntentBits.GuildVoiceStates,
				GatewayIntentBits.GuildMessages,
				GatewayIntentBits.MessageContent,
				GatewayIntentBits.GuildMessageReactions,
			],
			partials: [
				Partials.Message,
				Partials.Channel,
				Partials.Reaction,
				Partials.GuildMember,
				Partials.User,
			],
		});

		this.distube = new DisTube(this, {
			emitNewSongOnly: true,
			emitAddSongWhenCreatingQueue: true,
			plugins: [
				new YouTubePlugin({
					// cookies: JSON.parse(fs.readFileSync(cookiesPath).toString()),
				}),
				new SpotifyPlugin({
					api: {
						clientId,
						clientSecret,
					},
				}),
				new SoundCloudPlugin(),
			],
		});
	}

	async start(token: string): Promise<void> {
		this.utils.registerModules();
		super.login(token);
		console.log("Bot Login!");
	}

	async destroy(): Promise<void> {
		super.destroy();
	}
}
