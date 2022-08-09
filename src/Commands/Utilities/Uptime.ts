import { Command } from '../../Structures/Command';

export default new Command({
    name: 'uptime',
    description: 'This provides the current uptime of the bot',
    run: async ({ client, interaction }) => {
        const { uptime } = client;
        const ut = client.utils.duration(uptime);

        return await interaction.reply({ content: `My uptime is \`${ut}\`` });
    },
});
