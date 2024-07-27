import { EmbedBuilder } from "discord.js";
import { Command } from "../../Structures/Command";

export default new Command({
	name: "stop",
	description: "Disconnects the bot and clears queue.",
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
				content: `You're not in the same voice channel. I'm playing music in <#${members.me.voice.channelId}>.`,
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
			await queue.stop();
			queue.voice.leave();
			embed.setDescription(`${client.emote.STOP} **Stopped** the music.`);
			return await interaction.reply({ embeds: [embed] });
		} catch (error) {
			queue.voice.leave();
			embed.setDescription(`${client.emote.ERROR} | ${error}`);
			return await interaction.reply({
				embeds: [embed],
				ephemeral: true,
			});
		}
	},
});
