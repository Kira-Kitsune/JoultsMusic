import type {
	ButtonInteraction,
	CommandInteraction,
	CommandInteractionOptionResolver,
	GuildMember,
	PermissionResolvable,
	TextChannel,
	ModalSubmitInteraction,
	ModalSubmitFields,
	ChatInputApplicationCommandData,
} from "discord.js";
import type { JoultsMusicClient } from "../Structures/JoultsMusicClient";

//@ts-ignore
export interface JoultsMusicInteraction extends CommandInteraction {
	client: JoultsMusicClient;
	member: GuildMember;
}

//@ts-ignore
export interface JoultsButtonInteraction extends ButtonInteraction {
	client: JoultsMusicClient;
	member: GuildMember;
	channel: TextChannel;
}

//@ts-ignore
export interface JoultsModalInteraction extends ModalSubmitInteraction {
	client: JoultsMusicClient;
	member: GuildMember;
}

interface RunOptions {
	client: JoultsMusicClient;
	interaction: JoultsMusicInteraction;
	args: CommandInteractionOptionResolver;
}

interface ModalRunOptions {
	client: JoultsMusicClient;
	interaction: JoultsModalInteraction;
	fields: ModalSubmitFields;
}

type RunFunction = (options: RunOptions) => Promise<unknown>;
type ModalRunFunction = (options: ModalRunOptions) => Promise<unknown>;

export type CommandType = {
	userPermissions?: PermissionResolvable[];
	run: RunFunction;
	runModal?: ModalRunFunction;
	testOnly?: boolean;
	ownerOnly?: boolean;
	modOnly?: boolean;
	adminOnly?: boolean;
	nsfw?: boolean;
} & ChatInputApplicationCommandData;
