import { Client, Collection, GatewayIntentBits, Partials } from 'discord.js';
import { Emote } from '../Typings/Client';
import { CommandType } from '../Typings/Command';
import Util from './Util';

import DisTube from 'distube';
import { SpotifyPlugin } from '@distube/spotify';
import { SoundCloudPlugin } from '@distube/soundcloud';
import { YtDlpPlugin } from '@distube/yt-dlp';

const clientId = process.env.SPOTIFY_CLIENT_ID,
    clientSecret = process.env.SPOTIFY_SECRET_ID;

export class JoultsMusicClient extends Client {
    commands: Collection<string, CommandType> = new Collection();
    utils = new Util(this);
    emote = Emote;
    owner = process.env.OWNER;
    colour = 0xffbf00;
    distube = new DisTube(this, {
        emitNewSongOnly: true,
        leaveOnFinish: true,
        emitAddSongWhenCreatingQueue: true,
        emptyCooldown: 30,
        plugins: [
            new SpotifyPlugin({
                api: {
                    clientId,
                    clientSecret,
                },
            }),
            new SoundCloudPlugin(),
            new YtDlpPlugin({ update: false }),
        ],
    });

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
    }

    async start(token: string): Promise<void> {
        this.utils.registerModules();
        super.login(token);
        console.log('Bot Login!');
    }

    async destroy(): Promise<void> {
        super.destroy();
    }
}
