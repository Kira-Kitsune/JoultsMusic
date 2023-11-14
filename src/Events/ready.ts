import { Event } from '../Structures/Event';
import { JoultsMusicClient } from '../Structures/JoultsMusicClient';
import { guildCommands, slashCommands } from '../Structures/Util';
import { ActivityType, ChannelType } from 'discord.js';

//@ts-ignore
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

    setStatus(client);
    setInterval(() => setStatus(client), 15000);

    const owner = await client.users.fetch(client.owner);
    owner.send({
        content: `🏁 Started **${client.user.tag}**\n▶️ Loaded **${client.commands.size} commands!**`,
    });
});

let i = 0;
function setStatus(client: JoultsMusicClient) {
    const activities: string[] = [
        `In ${client.guilds.cache.size} servers!`,
        `Reading ${
            client.channels.cache.filter(
                (channel) => channel.type !== ChannelType.DM
            ).size
        } channels!`,
        `Watching ${client.guilds.cache.reduce(
            (accum, guild) => accum + guild.memberCount,
            0
        )} users!`,
        `Waiting for pats.`,
        `Vibing to your epic beats.`,
        `Getting pats from Kira.`,
        `Sleeping by Kira's side.`,
        `Getting cuddles by anyone.`,
        `Running through grass fields.`,
        `Snuggling into Kira.`,
        `Just being a fox.`,
        `Giving Kira licks on the face.`,
    ];
    client.user.setActivity({
        type: ActivityType.Listening,
        name: `Music | ${activities[i++ % activities.length]}`,
    });
}
