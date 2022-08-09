import { EmbedBuilder } from 'discord.js';
import { Command } from '../../Structures/Command';

export default new Command({
    name: 'previous',
    description: 'Go to the previous song.',
    dmPermission: false,
    run: async ({ client, interaction }) => {
        const { member, guild } = interaction;
        const { members } = guild;

        const voiceChannel = member.voice.channel;

        if (!voiceChannel)
            return await interaction.reply({
                content: 'You need to join a voice channel.',
                ephemeral: true,
            });
        if (
            members.me.voice.channelId &&
            voiceChannel.id !== members.me.voice.channelId
        )
            return await interaction.reply({
                content: `You're not in the same voice channel. I'm playing music in ${members.me.voice.channelId}.`,
                ephemeral: true,
            });

        const queue = await client.distube.getQueue(voiceChannel);
        if (!queue)
            return await interaction.reply({
                content: `There is no queue for this server.`,
                ephemeral: true,
            });

        const embed = new EmbedBuilder().setColor(client.colour);

        try {
            await queue.previous();
            embed.setDescription(
                `${client.emote.PREVIOUS} Went to **previous** song.`
            );
            return await interaction.reply({ embeds: [embed] });
        } catch (err) {
            embed.setDescription(`${client.emote.ERROR} | ${err}`);
            return await interaction.reply({
                embeds: [embed],
                ephemeral: true,
            });
        }
    },
});
