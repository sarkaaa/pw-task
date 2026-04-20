/**
 * Env variables are loaded in `playwright.config.ts` via dotenv before tests run.
 */
type EnvName = "EMAIL" | "PASSWORD" | "BASE_URL" | "AUTH0_DOMAIN" | "AUTH0_CLIENT_ID" | "AUTH0_REDIRECT_URI" | "AUTH0_USERNAME" | "AUTH0_PASSWORD"
export const requireEnv = (name: EnvName): string => {
	const value = process.env[name]
	if (value === undefined || value === "") {
		throw new Error(`${name} environment variable must be set`)
	}
	return value
}
