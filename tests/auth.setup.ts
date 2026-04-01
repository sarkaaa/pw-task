import path from "node:path"
import { expect, test as setup } from "@playwright/test"
import { LoginPage } from "../pages/LoginPage"
import { requireEnv } from "../utils/general"

const authFile = path.join(__dirname, "../playwright/.auth/user.json")

setup("authentication", async ({ page }) => {
	const token = requireEnv("TOKEN")
	const baseUrl = requireEnv("BASE_URL")

	const loginPage = new LoginPage(page)
	await loginPage.addJwtCookie(token, baseUrl)

	await page.goto("/account")
	await expect(page.getByTestId("overview-page-wrapper")).toBeVisible()
	await page.context().storageState({ path: authFile })
})
