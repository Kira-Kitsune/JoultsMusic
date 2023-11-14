import { Message } from 'discord.js';
import { JoultsMusicClient } from '../Structures/JoultsMusicClient';

//@ts-ignore
export interface JoultsBotMessage extends Message {
    client: JoultsMusicClient;
}
