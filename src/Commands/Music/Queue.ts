import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder,
} from 'discord.js';
import { Command } from '../../Structures/Command';

export default new Command({
    name: 'queue',
    description: 'Queue of the music in the server.',
    dmPermission: false,
    run: async ({ client, interaction }) => {
        const { member, guild, user } = interaction;
        const { members, name: guildName } = guild;

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

        const { songs } = queue;
        const amountpp = 10;

        const generateEmbed = (start: number) => {
            const current = songs.slice(start + 1, start + 1 + amountpp);

            const embed = new EmbedBuilder()
                .setColor(client.colour)
                .setTitle(
                    `Showing queue, Songs ${start + 1}-${
                        start + current.length
                    } out of ${songs.length - 1}`
                )
                .setTimestamp()
                .setFooter({
                    text: `Showing Page: ${start / amountpp + 1}/${Math.ceil(
                        (songs.length - 1) / amountpp
                    )} • Requested by ${user.username}`,
                    iconURL: user.displayAvatarURL(),
                });

            if (songs[0])
                embed.addFields([
                    {
                        name: `Current`,
                        value: `[${songs[0].name}](${songs[0].url})\nDuration: ${queue.formattedCurrentTime} / ${queue.songs[0].formattedDuration}`,
                    },
                    {
                        name: `Estimated Time Remaining in Queue`,
                        value: `${queue.formattedDuration}`,
                    },
                ]);

            !current.length
                ? embed.addFields({
                      name: `**Queue for __${guildName}__**`,
                      value: `No tracks in the queue`,
                  })
                : embed.addFields({
                      name: `**Queue for __${guildName}__**`,
                      value: `━━━━━━━━━━━━━━━━━━━━━━━━`,
                  });

            current.forEach((song, i) =>
                embed.addFields({
                    name: `Track ${start + ++i} - Duration: ${
                        song.formattedDuration
                    }`,
                    value: `[${song.name}](${song.url})\nRequested by ${song.user}`,
                })
            );

            return embed;
        };

        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
                .setLabel(`First`)
                .setStyle(ButtonStyle.Danger)
                .setCustomId(`first-queue`),

            new ButtonBuilder()
                .setLabel(`Back`)
                .setStyle(ButtonStyle.Danger)
                .setCustomId(`back-queue`),

            new ButtonBuilder()
                .setLabel(`Next`)
                .setStyle(ButtonStyle.Success)
                .setCustomId(`next-queue`),

            new ButtonBuilder()
                .setLabel(`Last`)
                .setStyle(ButtonStyle.Success)
                .setCustomId(`last-queue`),

            new ButtonBuilder()
                .setEmoji('🗑️')
                .setStyle(ButtonStyle.Primary)
                .setCustomId(`delete-queue`)
        );

        await interaction
            .reply({
                embeds: [generateEmbed(0)],
                components: [row],
                fetchReply: true,
            })
            .then((message) => {
                const collector = message.createMessageComponentCollector({
                    time: 120000,
                });

                let currentIndex = 0;
                collector.on('collect', (ButtonInteraction) => {
                    const id = ButtonInteraction.customId;

                    if (id === 'back-queue') {
                        if (currentIndex !== 0) {
                            currentIndex -= amountpp;
                            ButtonInteraction.update({
                                embeds: [generateEmbed(currentIndex)],
                                components: [row],
                            });
                        } else {
                            ButtonInteraction.update({
                                embeds: [generateEmbed(currentIndex)],
                                components: [row],
                            });
                        }
                    } else if (id === 'next-queue') {
                        if (currentIndex + amountpp < songs.length - 1) {
                            currentIndex += amountpp;
                            ButtonInteraction.update({
                                embeds: [generateEmbed(currentIndex)],
                                components: [row],
                            });
                        } else {
                            ButtonInteraction.update({
                                embeds: [generateEmbed(currentIndex)],
                                components: [row],
                            });
                        }
                    } else if (id === 'first-queue') {
                        currentIndex = 0;
                        ButtonInteraction.update({
                            embeds: [generateEmbed(currentIndex)],
                            components: [row],
                        });
                    } else if (id === 'last-queue') {
                        if (currentIndex + amountpp < songs.length - 1) {
                            currentIndex =
                                Math.floor((songs.length - 2) / amountpp) *
                                amountpp;
                            ButtonInteraction.update({
                                embeds: [generateEmbed(currentIndex)],
                                components: [row],
                            });
                        } else {
                            ButtonInteraction.update({
                                embeds: [generateEmbed(currentIndex)],
                                components: [row],
                            });
                        }
                    } else if (id === 'delete-queue') {
                        message.delete();
                    }
                });
            });
    },
});
