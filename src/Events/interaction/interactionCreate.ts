import { Event } from "../../Structures/Event";
import {
	type CommandInteractionOptionResolver,
	InteractionType,
	type TextChannel,
} from "discord.js";
import type {
	CommandType,
	JoultsMusicInteraction,
} from "../../Typings/Command";

export default new Event("interactionCreate", async (baseInteraction) => {
	const interaction = baseInteraction as JoultsMusicInteraction;
	if (interaction.type !== InteractionType.ApplicationCommand) return;
	const {
		commandName,
		client,
		user,
		channel: baseChannel,
		member,
		guild,
		options,
	} = interaction;

	const channel: TextChannel = <TextChannel>baseChannel;

	const command: CommandType = client.commands.get(commandName);
	const { ownerOnly, nsfw, modOnly, adminOnly } = command;

	if (ownerOnly && !client.utils.checkOwner(user.id))
		return await interaction.reply({
			content: "Sorry, this command can only be used by the bot owner.",
			ephemeral: true,
		});

	if (nsfw && !channel.nsfw)
		return await interaction.reply({
			content: "Sorry, this command can only be used in a NSFW channel.",
			ephemeral: true,
		});

	if (modOnly && guild) {
		const missing = member.permissions.missing("ManageMessages");
		if (missing.length)
			return await interaction.reply({
				content:
					"Sorry, this command can only be used by mods (Manage Message Permissions)",
				ephemeral: true,
			});
	}

	if (adminOnly && guild) {
		const missing = member.permissions.missing("Administrator");
		if (missing.length)
			return await interaction.reply({
				content: "Sorry, this command can only be used by admins",
				ephemeral: true,
			});
	}

	return await command.run({
		client,
		interaction,
		args: <CommandInteractionOptionResolver>options,
	});
});
