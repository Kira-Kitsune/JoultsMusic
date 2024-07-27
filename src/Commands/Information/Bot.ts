import { Command } from "../../Structures/Command";
import { EmbedBuilder, version } from "discord.js";
import os from "node:os";
import ms from "ms";
import { time } from "@discordjs/builders";

export default new Command({
	name: "bot",
	description: "Displays information about the bot",
	dmPermission: false,
	run: async ({ client, interaction }) => {
		const { user: botUser, channels, guilds, commands, uptime, utils } = client;
		const { guild, user } = interaction;
		const { createdTimestamp } = botUser;
		const core = os.cpus()[0];

		const embed: EmbedBuilder = new EmbedBuilder()
			.setAuthor({
				name: `Bot Information for ${botUser.tag}`,
				iconURL: botUser.displayAvatarURL(),
			})
			.setThumbnail(botUser.displayAvatarURL())
			.setColor(guild.members.me.displayHexColor || client.colour)
			.addFields([
				{ name: "🤖 Client", value: `${botUser} (${botUser.id})` },
				{
					name: "🏠 Servers",
					value: `${guilds.cache.size.toLocaleString()}`,
					inline: true,
				},
				{
					name: "👥 Users",
					value: `${guilds.cache
						.reduce((a, b) => a + b.memberCount, 0)
						.toLocaleString()}`,
					inline: true,
				},
				{
					name: "📣 Channels",
					value: `${channels.cache.size.toLocaleString()}`,
					inline: true,
				},
				{
					name: "▶ Commands",
					value: `${commands.size}`,
					inline: true,
				},
				{
					name: "⏱ Uptime",
					value: `${ms(uptime, { long: true })}`,
					inline: true,
				},
				{
					name: "📅 Creation Date",
					value: `${time(
						Math.floor(createdTimestamp / 1000),
					)},\n${client.utils.agoTime(createdTimestamp)}`,
				},
				{ name: "🤖 Bot Version", value: "v${version}", inline: true },
				{
					name: "<:discordjs:868151745962975262> discord.js",
					value: `v${version}`,
					inline: true,
				},
				{
					name: "<:nodejs:868151745975574528> node.js",
					value: `${process.version}`,
					inline: true,
				},
				{
					name: "🖥️ CPU",
					value: `Cores: ${os.cpus().length}\nSpeed: ${
						core.speed / 1000
					}GHz\nModel: ${core.model}`,
					inline: true,
				},
				{
					name: "🧠 Memory",
					value: `Used: ${utils.formatBytes(
						process.memoryUsage().heapUsed,
					)}\nTotal: ${utils.formatBytes(process.memoryUsage().heapTotal)}`,
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
