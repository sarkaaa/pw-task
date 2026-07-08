import { expect, test } from "@playwright/test"

test.describe("Checkout", () => {
	test.beforeEach(async ({ page }) => {
		const responsePromise = page.waitForResponse(
			(response) =>
				response.request().method() === "POST" &&
				response.url().includes("/products/hoodie") &&
				response.ok(),
		)

		// Add Hoodie to cart
		await page.goto("/products/hoodie")
		await page.getByTestId("add-product-button").click()
		await responsePromise
	})

	test("should display checkout page", async ({ page }) => {
		await page.goto("/cart")

		await expect(page.getByTestId("cart-container")).toBeVisible()
	})
})
