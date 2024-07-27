import { Command } from "../../Structures/Command";
import { ApplicationCommandOptionType, EmbedBuilder } from "discord.js";

export default new Command({
	name: "jump",
	description: "Jump to the song number in the queue.",
	options: [
		{
			name: "position",
			description:
				"Song number in the queue. The next one is 1, 2, etc. The previous one is -1, -2, etc.",
			type: ApplicationCommandOptionType.Integer,
			required: true,
		},
	],
	dmPermission: false,
	run: async ({ client, interaction, args }) => {
		const { member, guild } = interaction;
		const { members } = guild;

		const position = args.getInteger("position");

		if (position === 0)
			return await interaction.reply({
				content:
					"Please enter that is not zero (negatives can go to previous songs!).",
				ephemeral: true,
			});
		const voiceChannel = member.voice.channel;

		if (!voiceChannel)
			return await interaction.reply({
				content: "You need to join a voice channel.",
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
				content: "There is no queue for this server.",
				ephemeral: true,
			});

		const embed = new EmbedBuilder().setColor(client.colour);

		const emote = position < 0 ? client.emote.PREVIOUS : client.emote.SKIP;

		try {
			await queue.jump(position);
			embed.setDescription(
				`${emote} Jumped to position ${position} in the queue`,
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
