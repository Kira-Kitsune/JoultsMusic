import { Message } from 'discord.js';
import { JoultsMusicClient } from '../Structures/JoultsMusicClient';

export interface JoultsBotMessage extends Message {
    client: JoultsMusicClient;
}
