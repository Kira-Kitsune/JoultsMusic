import type { Message } from "discord.js";
import type { JoultsMusicClient } from "../Structures/JoultsMusicClient";

//@ts-ignore
export interface JoultsBotMessage extends Message {
	client: JoultsMusicClient;
}
