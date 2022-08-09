import {
    ButtonInteraction,
    CommandInteraction,
    CommandInteractionOptionResolver,
    GuildMember,
    PermissionResolvable,
    TextChannel,
    ModalSubmitInteraction,
    ModalSubmitFields,
    ChatInputApplicationCommandData,
} from 'discord.js';
import { JoultsMusicClient } from '../Structures/JoultsMusicClient';

export interface JoultsMusicInteraction extends CommandInteraction {
    client: JoultsMusicClient;
    member: GuildMember;
}

export interface JoultsButtonInteraction extends ButtonInteraction {
    client: JoultsMusicClient;
    member: GuildMember;
    channel: TextChannel;
}

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

type RunFunction = (options: RunOptions) => Promise<any>;
type ModalRunFunction = (options: ModalRunOptions) => Promise<any>;

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
