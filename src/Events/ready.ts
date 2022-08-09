import { Event } from '../Structures/Event';
import { JoultsMusicClient } from '../Structures/JoultsMusicClient';
import { guildCommands, slashCommands } from '../Structures/Util';
import { ActivityType, ChannelType } from 'discord.js';

export default new Event('ready', async (client: JoultsMusicClient) => {
    await client.utils.registerCommands({
        commands: guildCommands,
        guildId: process.env.GUILD_ID,
    });

    await client.utils.registerCommands({
        commands: slashCommands,
        guildId: null,
    });

    console.log(
        [
            `Started ${client.user.tag}`,
            `Loaded ${client.commands.size} commands!`,
        ].join('\n')
    );

    const activities: string[] = [
        `${client.guilds.cache.size} servers!`,
        `${
            client.channels.cache.filter((c) => c.type !== ChannelType.DM).size
        } channels!`,
        `${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)} users!`,
        `waiting for pats.`,
        `vibing to your epic beats.`,
        `getting pats from Kira.`,
        `sleeping by Kira's side.`,
        `getting cuddles.`,
        `running through grass fields.`,
        `snuggling into Kira`,
        `just being a fox.`,
        `waiting for DJ Thor's tunes.`,
        `giving Kira licks on the face.`,
    ];

    let i = 0;
    setInterval(
        () =>
            client.user.setActivity({
                type: ActivityType.Listening,
                name: `Music | ${activities[i++ % activities.length]}`,
            }),
        15000
    );

    const owner = await client.users.fetch(client.owner);
    owner.send({
        content: `🏁 Started **${client.user.tag}**\n▶️ Loaded **${client.commands.size} commands!**`,
    });
});
