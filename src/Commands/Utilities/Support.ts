import { Command } from '../../Structures/Command';
import { EmbedBuilder } from 'discord.js';

export default new Command({
    name: 'support',
    description: 'Support server, invite, tip, and vote links for JoultsBot.',
    run: async ({ client, interaction }) => {
        const { user } = interaction;
        const URL: string = `https://joultsbot.com`;

        const embed = new EmbedBuilder()
            .setTitle(`Useful links for JoultsBot`)
            .setThumbnail(client.user.displayAvatarURL())
            .setColor(client.colour)
            .setDescription(
                `[Support Server](https://discord.gg/invite/P4rRUzxf4c)
                \n[Invite JoultsBot](${URL}/invite)\u3000[Vote for JoultsBot](${URL}/vote)\u3000[Support Me!](${URL}/tip)
                \n[Terms of Service](${URL}/terms)\u3000[Privacy Policy](${URL}/privacy)`
            )
            .setFooter({
                text: `Requested by ${user.username}`,
                iconURL: user.displayAvatarURL(),
            })
            .setTimestamp();

        return await interaction.reply({ embeds: [embed] });
    },
});
