import { EmbedBuilder, quote } from "discord.js";
import { Command } from "../../Structures/Command";

export default new Command({
	name: "nowplaying",
	description: "Shows the song that is playing right now.",
	dmPermission: false,
	run: async ({ client, interaction }) => {
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

		const currentSong = queue.songs[0];
		const songUrl =
			currentSong.stream.playFromSource === true
				? currentSong.stream.url
				: // @ts-ignore
					currentSong.stream.song.stream.url;

		const embed = new EmbedBuilder()
			.setTitle(`${client.emote.PLAY} **Now Playing**`)
			.setColor(client.colour)
			.setDescription(`[${currentSong.name}](${songUrl}) [${currentSong.user}]`)
			.addFields([
				{
					name: "Time",
					value: `${queue.formattedCurrentTime} / ${currentSong.formattedDuration}`,
				},
			]);

		return await interaction.reply({ embeds: [embed] });
	},
});
