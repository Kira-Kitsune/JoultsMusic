import { EmbedBuilder } from 'discord.js';
import { Command } from '../../Structures/Command';

export default new Command({
    name: 'nowplaying',
    description: 'Shows the song that is playing right now.',
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
                content: `You're not in the same voice channel. I'm playing music in ${members.me.voice.channel}.`,
                ephemeral: true,
            });

        const queue = client.distube.getQueue(voiceChannel);
        if (!queue)
            return await interaction.reply({
                content: `There is no queue for this server.`,
                ephemeral: true,
            });

        const embed = new EmbedBuilder()
            .setTitle(`${client.emote.PLAY} **Now Playing**`)
            .setColor(client.colour)
            .setDescription(
                `[${queue.songs[0].name}](${queue.songs[0].url}) [${queue.songs[0].user}]`
            );

        return await interaction.reply({ embeds: [embed] });
    },
});
