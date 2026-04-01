/**
 * Env variables are loaded in `playwright.config.ts` via dotenv before tests run.
 */
type EnvName = "EMAIL" | "PASSWORD" | "TOKEN" | "BASE_URL"
export const requireEnv = (name: EnvName): string => {
	const value = process.env[name]
	if (value === undefined || value === "") {
		throw new Error(`${name} environment variable must be set`)
	}
	return value
}
