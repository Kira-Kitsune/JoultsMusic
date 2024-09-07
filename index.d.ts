declare global {
	namespace NodeJS {
		interface ProcessEnv {
			TOKEN: string;
			GUILD_ID: string;
			CLIENT_ID: string;
			OWNER: string;
			SPOTIFY_CLIENT_ID: string;
			SPOTIFY_SECRET_ID: string;
			COOKIES_PATH: STRING;
		}
	}
}

export type {};
