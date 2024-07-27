import { Event } from "../../Structures/Event";
import { isVoiceChannelEmpty } from "distube";
import type { JoultsMusicClient } from "../../Structures/JoultsMusicClient";

export default new Event("voiceStateUpdate", async (oldState, _) => {
	if (!oldState?.channel) return;
	const voice = (oldState.client as JoultsMusicClient).distube.voices.get(
		oldState,
	);
	if (voice && isVoiceChannelEmpty(oldState)) voice.leave();
});
