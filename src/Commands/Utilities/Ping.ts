import { Command } from '../../Structures/Command';

export default new Command({
    name: 'ping',
    description: 'Provides the ping of the bot',
    run: async ({ client, interaction }) => {
        const { createdTimestamp } = interaction;
        await interaction.reply({ content: 'Pinging...' });

        const latency: number = Date.now() - createdTimestamp;

        return await interaction.editReply({
            content: `Pong! - Rest Latency: \`${latency}ms\` | Websocket Latency: \`${client.ws.ping}ms\``,
        });
    },
});
