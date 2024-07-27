import type { ApplicationCommandDataResolvable } from "discord.js";

export interface RegisterCommandsOptions {
	guildId?: string;
	commands: ApplicationCommandDataResolvable[];
}

export enum Emote {
	PLAY = "▶️",
	PAUSE = "⏸️",
	SKIP = "⏭️",
	PREVIOUS = "⏮️",
	REPEAT = "🔁",
	REPEAT_ONCE = "🔂",
	SHUFFLE = "🔀",
	STOP = "⏹",
	STOP_SIGN = "🛑",
	SUCCESS = "<:tickMark:855581458390056983>",
	ERROR = "<:crossMark:855581458247581696>",
}
