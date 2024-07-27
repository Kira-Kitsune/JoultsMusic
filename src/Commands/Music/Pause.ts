import { EmbedBuilder } from "discord.js";
import { Command } from "../../Structures/Command";

export default new Command({
	name: "pause",
	description: "Pauses the music from the bot.",
	dmPermission: false,
	run: async ({ client, interaction }) => {
		const { member, guild } = interaction;
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

		const queue = client.distube.getQueue(voiceChannel);
		if (!queue)
			return await interaction.reply({
				content: "There is no queue for this server.",
				ephemeral: true,
			});

		const embed = new EmbedBuilder().setColor(client.colour);

		try {
			embed.setDescription(`${client.emote.PAUSE} **Paused** the music.`);
			queue.pause();
			return await interaction.reply({ embeds: [embed] });
		} catch (error) {
			embed.setDescription(`${client.emote.ERROR} | ${error}`);
			return await interaction.reply({
				embeds: [embed],
				ephemeral: true,
			});
		}
	},
});
