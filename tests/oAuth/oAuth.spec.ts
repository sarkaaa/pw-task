import { expect, test } from "@playwright/test"
import { requireEnv } from "../../utils/general"
import { generatePKCE } from "../../utils/oauth/generatePKCE"

test("OAuth 2.0 PKCE Flow @oauth", async ({ page, request, baseURL }) => {
	const clientId = requireEnv("AUTH0_CLIENT_ID")
	const redirectUri = requireEnv("AUTH0_REDIRECT_URI")
	const username = requireEnv("AUTH0_USERNAME")
	const password = requireEnv("AUTH0_PASSWORD")

	if (!clientId || !redirectUri || !username || !password) {
		throw new Error("Missing required oAuth environment variables")
	}

	const { verifier, challenge } = generatePKCE()

	const authUrl = new URL(`https://${baseURL}/authorize`)
	authUrl.searchParams.set("response_type", "code")
	authUrl.searchParams.set("code_challenge", challenge)
	authUrl.searchParams.set("code_challenge_method", "S256")
	authUrl.searchParams.set("client_id", clientId)
	authUrl.searchParams.set("redirect_uri", redirectUri)
	authUrl.searchParams.set("scope", "openid profile email")

	await page.goto(authUrl.toString())

	await page.fill('input[name="username"]', username)
	await page.fill('input[name="password"]', password)
	await page.click('button[type="submit"], button:has-text("Continue")')

	await page.waitForURL(new RegExp(redirectUri))
	const url = new URL(page.url())
	const code = url.searchParams.get("code")

	expect(code).not.toBeNull()

	const tokenResponse = await request.post(`https://${baseURL}/oauth/token`, {
		form: {
			grant_type: "authorization_code",
			client_id: clientId,
			code_verifier: verifier,
			code: code ?? "",
			redirect_uri: redirectUri,
		},
	})

	const tokens = await tokenResponse.json()
	expect(tokenResponse.ok()).toBeTruthy()
	expect(tokens).toHaveProperty("access_token")

	await expect(
		page.getByText(
			"This is an example page simulating an OAuth 2.0 / OIDC authorization callback.",
		),
	).toBeVisible()
})
