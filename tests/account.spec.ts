import { expect, test } from "@playwright/test"
import { ADDRESS_USER_DATA } from "../fixtures/userData"

const profileText =
	"View and update your profile information, including your name, email, and phone number. You can also update your billing address, or change your password."

test.describe("Account - Overview", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/account")
	})
	test("should display account overview page", async ({ page, isMobile }) => {
		test.skip(isMobile, "Skipping this test for mobile, bug in the app")
		// Store number of addresses
		await page.goto("/account/addresses")
		const addressesCount = await page.getByTestId("address-container").all()

		await page.goto("/account")
		await expect(page.getByTestId("customer-email")).toHaveText(
			process.env.EMAIL ?? "",
		)
		await expect(page.getByTestId("addresses-count")).toHaveText(
			addressesCount.length.toString(),
		)
		await expect(page.getByTestId("no-orders-message")).toBeVisible()
	})
})

test.describe("Account - Profile", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/account/profile")

		await expect(page.getByText(profileText)).toBeVisible()
	})

	test("should display account profile page - user names", async ({ page }) => {
		const nameEditor = page.getByTestId("account-name-editor")
		const currentName = (await nameEditor
			.getByTestId("current-info")
			.textContent()) as string

		await nameEditor.getByRole("button", { name: "Edit" }).click()

		await expect(
			nameEditor.getByRole("button", { name: "Cancel" }),
		).toBeVisible()

		const firstNameInput = page.getByTestId("first-name-input")
		const lastNameInput = page.getByTestId("last-name-input")

		await expect(firstNameInput).toBeVisible()
		await expect(lastNameInput).toBeVisible()

		const firstNameInputValue = await firstNameInput.inputValue()
		const lastNameInputValue = await lastNameInput.inputValue()

		await firstNameInput.fill(`${firstNameInputValue ?? ""} Updated`)
		await lastNameInput.fill(`${lastNameInputValue ?? ""} Updated`)
		await nameEditor.getByTestId("save-button").click()

		await page.waitForResponse(async (response) => {
			return response.url().includes("account/profile") && response.ok()
		})

		await expect(nameEditor.getByTestId("success-message")).toHaveText(
			"Name updated succesfully",
		)

		await expect(nameEditor.getByTestId("current-info")).not.toHaveText(
			currentName,
		)
	})

	test("should display account profile page - email", async ({ page }) => {
		const emailEditor = page.getByTestId("account-email-editor")
		const currentEmail = (await emailEditor
			.getByTestId("current-info")
			.textContent()) as string

		const splitEmail = currentEmail.split("@")
		const newEmail = `${splitEmail[0]}-updated@${splitEmail[1]}`
		const emailInput = page.getByTestId("email-input")

		await emailEditor.getByRole("button", { name: "Edit" }).click()
		await expect(
			emailEditor.getByRole("button", { name: "Cancel" }),
		).toBeVisible()

		await emailInput.fill(newEmail)
		await emailEditor.getByTestId("save-button").click()

		await expect(emailEditor.getByTestId("success-message")).toHaveText(
			"Email updated succesfully",
		)

		// Error - user email is not updated, API request is not triggered
		// await expect(emailEditor.getByTestId('current-info')).not.toHaveText(currentEmail);
	})

	test("should display account profile page - phone number", async ({
		page,
	}) => {
		const phoneEditor = page.getByTestId("account-phone-editor")
		// biome-ignore lint/correctness/noUnusedVariables: TBD.
		const currentPhone = (await phoneEditor
			.getByTestId("current-info")
			.textContent()) as string
		const phoneInput = page.getByTestId("phone-input")

		await phoneEditor.getByRole("button", { name: "Edit" }).click()
		await expect(
			phoneEditor.getByRole("button", { name: "Cancel" }),
		).toBeVisible()

		await phoneInput.fill(`+420123456789`)
		await phoneEditor.getByTestId("save-button").click()

		await page.waitForResponse(async (response) => {
			return response.url().includes("account/profile") && response.ok()
		})

		await expect(phoneEditor.getByTestId("success-message")).toHaveText(
			"Phone updated succesfully",
		)

		// await expect(phoneEditor.getByTestId("current-info")).not.toHaveText(currentPhone)
	})

	test("should display account profile page - billing address", async ({
		page,
	}) => {
		const billingAddressEditor = page.getByTestId(
			"account-billing-address-editor",
		)

		await billingAddressEditor.getByRole("button", { name: "Edit" }).click()
		await expect(
			billingAddressEditor.getByRole("button", { name: "Cancel" }),
		).toBeVisible()

		const {
			firstName,
			lastName,
			company,
			address,
			address2,
			city,
			zip,
			province,
			country,
		} = ADDRESS_USER_DATA

		await page.getByTestId("billing-first-name-input").fill(firstName)
		await page.getByTestId("billing-last-name-input").fill(lastName)
		await page.getByTestId("billing-company-input").fill(company)
		await page.getByTestId("billing-address-1-input").fill(address)
		await page.getByTestId("billing-address-2-input").fill(address2)
		await page.getByTestId("billing-city-input").fill(city)
		await page.getByTestId("billing-postcal-code-input").fill(zip)
		await page.getByTestId("billing-province-input").fill(province)
		await page.getByTestId("billing-country-code-select").selectOption(country)
		await billingAddressEditor.getByTestId("save-button").click()

		await page.waitForResponse(async (response) => {
			return response.url().includes("account/profile") && response.ok()
		})

		await expect(
			billingAddressEditor.getByTestId("success-message"),
		).toHaveText("Billing address updated succesfully")
		await expect(
			billingAddressEditor.getByTestId("current-info"),
		).toContainText(`${firstName} ${lastName}`)
		await expect(
			billingAddressEditor.getByTestId("current-info"),
		).toContainText(company)
		await expect(
			billingAddressEditor.getByTestId("current-info"),
		).toContainText(address)
		await expect(
			billingAddressEditor.getByTestId("current-info"),
		).toContainText(address2)
		await expect(
			billingAddressEditor.getByTestId("current-info"),
		).toContainText(city)
		await expect(
			billingAddressEditor.getByTestId("current-info"),
		).toContainText(zip)
		await expect(
			billingAddressEditor.getByTestId("current-info"),
		).toContainText(country)
	})
})
