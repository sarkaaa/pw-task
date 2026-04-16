import { expect, test } from "@playwright/test"
import { INVALID_LOGIN_CASES } from "../fixtures/userData"
import { LoginPage } from "../pages/LoginPage"
import { requireEnv } from "../utils/general"
import { showLoginError } from "../utils/loginError"

test.use({ storageState: { cookies: [], origins: [] } })

test.describe("Login tests", () => {
	let loginPage: LoginPage

	test.beforeEach(async ({ page }) => {
		loginPage = new LoginPage(page)
		await loginPage.goto()
	})

	test.describe("sign-in and invalid credentials", () => {
		test("should be logged in via UI", async ({ isMobile }) => {
			const email = requireEnv("EMAIL")
			const password = requireEnv("PASSWORD")
			await loginPage.login(email, password)

			if (isMobile) {
				await expect(loginPage.mobileAccountNavigation).toBeVisible()
			} else {
				await expect(loginPage.desktopAccountNavigation).toBeVisible()
				await expect(loginPage.overviewPageWrapper).toBeVisible()
			}
		})

		for (const { name, email, password } of INVALID_LOGIN_CASES) {
			test(`should show error message when ${name}`, async () => {
				await loginPage.attemptLogin(email, password)
				await showLoginError({ loginPage })
			})
		}
	})

	test("should create a new account - form is present", async () => {
		/**
		 * User account creation is excluded from this test suite due to production environment of the website.
		 */
		await loginPage.clickRegister()

		// Sign up form is present
		await expect(loginPage.registerPage).toBeVisible()

		// Redirection to login page after clicking on "Sign in" button
		await loginPage.clickSignInFromRegister()
		await expect(loginPage.loginPage).toBeVisible()
	})
})
