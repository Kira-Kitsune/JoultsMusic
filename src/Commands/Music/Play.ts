import { ApplicationCommandOptionType, EmbedBuilder } from "discord.js";
import { Command } from "../../Structures/Command";

export default new Command({
	name: "play",
	description: "Plays a song/playlist from YouTube/Spotify/SoundCloud.",
	options: [
		{
			name: "request",
			description: "The song/playlist you want to play.",
			type: ApplicationCommandOptionType.String,
			required: true,
		},
		{
			name: "position",
			description: "The position you want to put the song (1 is next song).",
			type: ApplicationCommandOptionType.Integer,
			required: false,
			minValue: 1,
		},
	],
	dmPermission: false,
	run: async ({ client, interaction, args }) => {
		const { member, guild, channel } = interaction;
		const { members } = guild;

		const { channel: voiceChannel } = member.voice;

		if (!voiceChannel)
			return await interaction.reply({
				content: "You need to join a voice channel.",
				ephemeral: true,
			});

		const { channelId: botChId } = members.me.voice;

		if (botChId && voiceChannel.id !== botChId)
			return await interaction.reply({
				content: `You're not in the same voice channel. I'm playing music in ${members.me.voice.channel}.`,
				ephemeral: true,
			});

		const search = args.getString("request");
		let position = args.getInteger("position") || 0;

		const embed = new EmbedBuilder().setColor(client.colour);
		const queueLength =
			client.distube.getQueue(voiceChannel)?.songs?.length || 0;

		if (position > queueLength) position = 0;

		try {
			client.distube.play(voiceChannel, search, {
				textChannel: channel,
				member: member,
				position: position,
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
