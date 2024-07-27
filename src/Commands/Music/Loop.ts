import { ApplicationCommandOptionType, EmbedBuilder } from "discord.js";
import { Command } from "../../Structures/Command";

export default new Command({
	name: "loop",
	description: "Loop the queue or song.",
	options: [
		{
			name: "queue",
			description: "Loop the queue.",
			type: ApplicationCommandOptionType.Subcommand,
			options: [],
		},
		{
			name: "song",
			description: "Loop the song.",
			type: ApplicationCommandOptionType.Subcommand,
			options: [],
		},
	],
	dmPermission: false,
	run: async ({ client, interaction, args }) => {
		const { member, guild } = interaction;
		const { members } = guild;

		const voiceChannel = member.voice.channel;

		if (!voiceChannel)
			return await interaction.reply({
				content: "You need to join a voice channel.",
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
				content: "There is no queue for this server.",
				ephemeral: true,
			});

		const typeRepeat = args.getSubcommand();

		const mode = queue.repeatMode === 0 ? (typeRepeat === "queue" ? 2 : 1) : 0;

		const isRepeating = queue.repeatMode === 0 ? "Enabled" : "Disabled";
		queue.setRepeatMode(mode);

		const embed = new EmbedBuilder()
			.setColor(client.colour)
			.setDescription(
				typeRepeat === "queue"
					? `${client.emote.REPEAT} **${isRepeating}** queue repeat.`
					: `${client.emote.REPEAT_ONCE} **${isRepeating}** track repeat.`,
			);

		return await interaction.reply({ embeds: [embed] });
	},
});
