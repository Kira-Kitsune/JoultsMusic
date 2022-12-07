import { ApplicationCommandOptionType, EmbedBuilder } from 'discord.js';
import { Command } from '../../Structures/Command';

export default new Command({
    name: 'play',
    description: 'Plays a song/playlist from YouTube/Spotify/SoundCloud.',
    options: [
        {
            name: 'request',
            description: 'The song/playlist you want to play.',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
    ],
    dmPermission: false,
    run: async ({ client, interaction, args }) => {
        const { member, guild, channel } = interaction;
        const { members } = guild;

        const { channel: voiceChannel } = member.voice;

        if (!voiceChannel)
            return await interaction.reply({
                content: 'You need to join a voice channel.',
                ephemeral: true,
            });

        const { channelId: botChId } = members.me.voice;

        if (botChId && voiceChannel.id !== botChId)
            return await interaction.reply({
                content: `You're not in the same voice channel. I'm playing music in ${members.me.voice.channel}.`,
                ephemeral: true,
            });

        const search = args.getString('request');

        const embed = new EmbedBuilder().setColor(client.colour);

        try {
            client.distube.play(voiceChannel, search, {
                textChannel: channel,
                member: member,
            });
            embed.setDescription(`${client.emote.PLAY} Queued request`);
            return await interaction.reply({
                embeds: [embed],
                ephemeral: true,
            });
        } catch (err) {
            embed.setDescription(`${client.emote.ERROR} | ${err}`);
            return await interaction.reply({
                embeds: [embed],
                ephemeral: true,
            });
        }
    },
});
