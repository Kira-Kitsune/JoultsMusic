import { Command } from "../../Structures/Command";
import { EmbedBuilder } from "discord.js";

export default new Command({
	name: "support",
	description: "Support server, invite, tip, and vote links for JoultsBot.",
	run: async ({ client, interaction }) => {
		const { user } = interaction;
		const BaseURL = new URL("https://joultsbot.com");

		const embed = new EmbedBuilder()
			.setTitle("Useful links for JoultsBot")
			.setThumbnail(client.user.displayAvatarURL())
			.setColor(client.colour)
			.setFields([
				{
					name: "📝 Terms of Service",
					value: `[Link](${new URL("/terms", BaseURL)})`,
					inline: true,
				},
				{
					name: "🔏 Privacy Policy",
					value: `[Link](${new URL("/privacy", BaseURL)})`,
					inline: true,
				},
				{
					name: "ℹ️ Support Server",
					value: "[Link](https://discord.gg/invite/P4rRUzxf4c)",
					inline: true,
				},
				{
					name: "💌 Invite JoultsBot",
					value: `[Link](${new URL("/invite", BaseURL)})`,
					inline: true,
				},
				{
					name: "🗳️ Vote for JoultsBot",
					value: `[Link](${new URL("/vote", BaseURL)})`,
					inline: true,
				},
				{
					name: "💵 Support Me!",
					value: `[Link](${new URL("/tip", BaseURL)})`,
					inline: true,
				},
			])
			.setFooter({
				text: `Requested by ${user.username}`,
				iconURL: user.displayAvatarURL(),
			})
			.setTimestamp();

		return await interaction.reply({ embeds: [embed] });
	},
});
