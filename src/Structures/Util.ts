import { JoultsMusicClient } from './JoultsMusicClient';
import {
    ApplicationCommandData,
    ApplicationCommandDataResolvable,
    ClientEvents,
} from 'discord.js';
import { RegisterCommandsOptions } from '../Typings/Client';
import { CommandType } from '../Typings/Command';
import { Event } from './Event';

import {
    HumanizeDurationLanguage,
    HumanizeDuration,
} from 'humanize-duration-ts';

import path from 'path';
import glob from 'glob-promise';

export const guildCommands: ApplicationCommandDataResolvable[] = [];
export const slashCommands: ApplicationCommandDataResolvable[] = [];

export default class Util {
    private client: JoultsMusicClient;

    constructor(client: JoultsMusicClient) {
        this.client = client;
    }

    agoTime(timestamp: number): string {
        const langService: HumanizeDurationLanguage =
            new HumanizeDurationLanguage();
        langService.addLanguage(`shortEn`, {
            y: function (c) {
                return 'year' + (c === 1 ? '' : 's');
            },
            mo: function (c) {
                return 'month' + (c === 1 ? '' : 's');
            },
            w: function (c) {
                return 'week' + (c === 1 ? '' : 's');
            },
            d: function (c) {
                return 'day' + (c === 1 ? '' : 's');
            },
            h: function (c) {
                return 'hour' + (c === 1 ? '' : 's');
            },
            m: function (c) {
                return 'min' + (c === 1 ? '' : 's');
            },
            s: function (c) {
                return 'sec' + (c === 1 ? '' : 's');
            },
            ms: function () {
                return 'ms';
            },
            decimal: '.',
        });
        const duration: HumanizeDuration = new HumanizeDuration(langService);
        duration.setOptions({
            conjunction: ` and `,
            serialComma: false,
            units: ['y', 'mo', 'd', 'h', 'm', 's'],
            round: true,
            language: 'shortEn',
        });

        return `${duration.humanize(Date.now() - timestamp)} ago`;
    }

    checkOwner(target: string): boolean {
        return this.client.owner === target;
    }

    formatArray(array: any[]): string {
        if (array.length <= 1) return array.toString();
        const last: string = array.pop().toString();
        const formatedArray = array.join(', ').concat(' and ', last);
        return formatedArray;
    }

    formatBytes(bytes: number): string {
        if (bytes === 0) return '0 Bytes';
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${
            sizes[i]
        }`;
    }

    duration(ms: number) {
        const secs = Math.floor((ms / 1000) % 60).toString();
        const mins = Math.floor((ms / (1000 * 60)) % 60).toString();
        const hrs = Math.floor((ms / (1000 * 60 ** 2)) % 60).toString();
        const days = Math.floor((ms / (1000 * 60 ** 2 * 24)) % 60).toString();

        return `${days.padStart(1, '0')} days, ${hrs.padStart(
            2,
            '0'
        )} hours, ${mins.padStart(2, '0')} mins, ${secs.padStart(2, '0')} secs`;
    }

    async registerModules(): Promise<void> {
        await this.loadCommands();
        await this.loadEvents();
    }

    async importFile(
        filePath: string
    ): Promise<CommandType | Event<keyof ClientEvents>> {
        return (await import(filePath))?.default;
    }

    async registerCommands({
        commands,
        guildId,
    }: RegisterCommandsOptions): Promise<void> {
        if (guildId) {
            this.client.guilds.cache.get(guildId).commands.set(commands);
            commands.forEach(({ name }: ApplicationCommandData) => {
                console.log(`Added ${name} (/) as guild command!`);
            });
            console.log(`Registering commands to ${guildId}`);
        } else {
            this.client.application.commands.set(commands);
            commands.forEach(({ name }: ApplicationCommandData) => {
                console.log(`Added ${name} (/) as global command!`);
            });
            console.log(`Registering global commands`);
        }
    }

    globPath(folder: string) {
        return path
            .join(__dirname, `../${folder}/**/*.ts`)
            .replaceAll('\\', '/');
    }

    async loadCommands(): Promise<void> {
        const commandFiles = await glob.promise(this.globPath('Commands'));
        commandFiles.forEach(async (filePath) => {
            delete require.cache[filePath];
            const command: CommandType = <CommandType>(
                await this.importFile(filePath)
            );
            if (!command.name) return;

            this.client.commands.set(command.name, command);
            command.testOnly
                ? guildCommands.push(command)
                : slashCommands.push(command);
        });
    }

    async loadEvents(): Promise<void> {
        const eventFiles = await glob.promise(this.globPath('Events'));
        eventFiles.forEach(async (filePath) => {
            const event: Event<keyof ClientEvents> = <
                Event<keyof ClientEvents>
            >await this.importFile(filePath);
            this.client.on(event.event, event.run);
        });
    }
}
