import path from "node:path"
import { expect, test as setup } from "@playwright/test"
import { LoginPage } from "../pages/LoginPage"
import { requireEnv } from "../utils/general"

const authFile = path.join(__dirname, "./.auth/user.json")

setup("authentication", async ({ page }) => {
	const email = requireEnv("EMAIL")
	const password = requireEnv("PASSWORD")

	const loginPage = new LoginPage(page)

	await loginPage.goto()
	await loginPage.login(email, password)

	await expect(page.getByTestId("overview-page-wrapper")).toBeVisible()
	await page.context().storageState({ path: authFile })
})
