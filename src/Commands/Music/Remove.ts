import { Command } from '../../Structures/Command';
import { ApplicationCommandOptionType, EmbedBuilder } from 'discord.js';
import stringSimilarity from 'string-similarity';

export default new Command({
    name: 'remove',
    description: 'Remove a song in the queue',
    dmPermission: false,
    options: [
        {
            name: 'position',
            description: 'Remove a song using the position in the queue.',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'position',
                    description: 'The position in the queue you want to remove',
                    type: ApplicationCommandOptionType.Integer,
                    required: true,
                },
            ],
        },
        {
            name: 'by-name',
            description:
                'Remove a song using the name of song, similarity will be taken into account.',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'song-name',
                    description:
                        'The name of the song that you want to remove, similarity will be taken into account.',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                },
            ],
        },
        {
            name: 'your-last-song',
            description:
                'Remove the last song in the queue that was added by you.',
            type: ApplicationCommandOptionType.Subcommand,
            options: [],
        },
    ],
    run: async ({ client, interaction, args }) => {
        const { guild, member } = interaction;
        const { members } = guild;

        const voiceChannel = member.voice.channel;

        if (!voiceChannel)
            return await interaction.reply({
                content: 'You need to join a voice channel.',
            });

        if (
            members.me.voice.channelId &&
            voiceChannel.id !== members.me.voice.channelId
        )
            return await interaction.reply({
                content: `You're not in the same voice channel. I'm playing music in ${members.me.voice.channel}.`,
            });

        const queue = client.distube.getQueue(voiceChannel);
        if (!queue)
            return await interaction.reply({
                content: `There is no queue for this server.`,
                ephemeral: true,
            });

        const embed = new EmbedBuilder().setColor(client.colour);

        switch (args.getSubcommand()) {
            case 'position':
                const position = args.getInteger('position');
                if (position > queue.songs.length)
                    return await interaction.reply({
                        content: `Please enter a position within the queue (Last Position: ${queue.songs.length})`,
                        ephemeral: true,
                    });
                if (position === 0)
                    return await interaction.reply({
                        content: `You cannot remove the current song!`,
                        ephemeral: true,
                    });
                if (position < 0)
                    return await interaction.reply({
                        content: `Please enter a position greater than 0`,
                        ephemeral: true,
                    });
                const removedSong = queue.songs.splice(position, 1);
                queue.songs = queue.songs;
                embed.setDescription(
                    `🗑️ Removed [${removedSong[0].name}](${removedSong[0].url}) from queue`
                );
                break;
            case 'by-name':
                const searchedSong = args.getString('song-name');
                const songListNames = Array.from(
                    queue.songs,
                    ({ name }) => name
                );
                const matches = stringSimilarity.findBestMatch(
                    searchedSong,
                    songListNames
                );

                const { bestMatch, bestMatchIndex } = matches;

                if (bestMatch.rating < 0.5)
                    return await interaction.reply({
                        content: `Please be more specific with the song you entered`,
                        ephemeral: true,
                    });

                const removedSongName = queue.songs.splice(bestMatchIndex, 1);
                queue.songs = queue.songs;
                embed.setDescription(
                    `🗑️ Removed [${removedSongName[0].name}](${removedSongName[0].url}) from queue`
                );
                break;
            case 'your-last-song':
                const songListUser = Array.from(
                    queue.songs,
                    ({ member }) => member.id
                );
                const matchedIdIndex = songListUser.lastIndexOf(member.id);
                if (matchedIdIndex === -1)
                    return await interaction.reply({
                        content: `You have no songs in the queue!`,
                        ephemeral: true,
                    });
                const removedSongLast = await queue.songs.splice(
                    matchedIdIndex,
                    1
                );
                queue.songs = queue.songs;
                embed.setDescription(
                    `🗑️ Removed [${removedSongLast[0].name}](${removedSongLast[0].url}) from queue`
                );
                break;
        }
        return await interaction.reply({ embeds: [embed] });
    },
});
