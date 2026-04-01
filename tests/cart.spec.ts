import { expect, test } from "@playwright/test"
import { HOODIE, PRODUCTS } from "../fixtures/products"
import {
	checkProductTitlePricePair,
	checkSortedPrices,
	expectedPricesLowToHigh,
	waitForSortResponse,
} from "../utils/sortPrices"

test.describe("Cart", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/")

		await page.getByTestId("nav-menu-button").click()
		await page
			.getByTestId("nav-menu-popup")
			.getByRole("link", { name: "Store" })
			.click()

		await expect(page.getByTestId("products-list")).toBeVisible()
	})

	test.describe("Cart - Sorting", () => {
		test("should sort by latest arrivals", async ({ page }) => {
			await page.goto("/store?sortBy=created_at")

			const cartItems = await page.getByTestId("product-wrapper").all()

			for (const cartItem of cartItems) {
				await checkProductTitlePricePair(cartItem)
			}
		})

		test("should sort by price: low to high", async ({ page }) => {
			const expectedSorted = expectedPricesLowToHigh(PRODUCTS)
			await page.getByText("Price: Low -> High").click()
			await waitForSortResponse(
				page,
				"/store?sortBy=price_asc",
				expectedSorted[0],
			)

			await checkSortedPrices(page, expectedSorted)
		})

		test("should sort by price: high to low", async ({ page }) => {
			const expectedSorted = expectedPricesLowToHigh(PRODUCTS)
			await page.getByText("Price: High -> Low").click()
			await waitForSortResponse(
				page,
				"/store?sortBy=price_desc",
				expectedSorted[expectedSorted.length - 1],
			)

			// Reverse sorted prices for high to low check
			await checkSortedPrices(page, expectedSorted.reverse())
		})
	})

	test.describe("Cart management", () => {
		test("should add a product to the cart", async ({ page, isMobile }) => {
			// Get Hoodie data from fixtures
			const hoodie = PRODUCTS.find((product) => product.name === "Hoodie")
			if (!hoodie) {
				throw new Error("Hoodie not found in fixtures")
			}

			await page.getByText(hoodie.name).click()

			await test.step("Check product page content", async () => {
				await expect(page.getByTestId("product-container")).toBeVisible()

				await expect(page.getByTestId("product-description")).toHaveText(
					HOODIE.description,
				)
				// Check number of images
				const allImages = await page.locator("[id*='img_']").all()
				expect(allImages).toHaveLength(3)

				const productInfoSection = await page
					.getByRole("heading", { level: 3 })
					.filter({ hasText: HOODIE.productInfo.title })

				// Assert first opened region
				const productInfoSectionContent = page.getByRole("region")

				productInfoSection.getByRole("button").click()

				await expect(
					productInfoSectionContent.getByText(
						HOODIE.productInfo.countryOfOriginTitle,
					),
				).toBeVisible()
				await expect(
					productInfoSectionContent
						.locator("p")
						.getByText(HOODIE.productInfo.countryOfOrigin),
				).toBeVisible()

				const shippingInfoSection = await page
					.getByRole("heading", { level: 3 })
					.filter({ hasText: HOODIE.shippingAndReturnInfo.title })

				shippingInfoSection.getByRole("button").click()

				await expect(
					page.getByText(HOODIE.shippingAndReturnInfo.shippingInfo),
				).toBeVisible()

				await expect(
					page.getByText(HOODIE.shippingAndReturnInfo.exchangeIngo),
				).toBeVisible()
				await expect(
					page.getByText(HOODIE.shippingAndReturnInfo.returnInfo),
				).toBeVisible()

				// Related products are visible
				await expect(
					page.getByTestId("related-products-container"),
				).toBeVisible()
				await expect(
					page
						.getByTestId("related-products-container")
						.getByText(HOODIE.relatedProductsTitle),
				).toBeVisible()
			})

			await test.step("Add product to cart", async () => {
				await expect(page.getByTestId("product-price")).toHaveText(hoodie.price)

				await expect(page.getByTestId("add-product-button")).toHaveText(
					"Add to cart",
				)
				await page.getByTestId("add-product-button").click()

				await expect(page.getByTestId("nav-cart-link")).toHaveText("Cart (1)")

				if (isMobile) {
					// Mobile: nav link navigates to the cart page (no hover dropdown).
					await Promise.all([
						page.waitForURL((url) => url.pathname.includes("/cart")),
						page.getByTestId("nav-cart-link").click(),
					])
					// await expect(page.getByTestId("cart-container")).toBeVisible()
				} else {
					const cartDropdown = page.getByTestId("nav-cart-dropdown")
					await expect(cartDropdown).toBeVisible()
					await expect(cartDropdown.getByText(hoodie.name)).toBeVisible()
					await expect(cartDropdown.getByTestId("cart-subtotal")).toHaveText(
						hoodie.price,
					)
					await cartDropdown.getByRole("button", { name: "Go to cart" }).click()
					await page.waitForResponse(
						(response) => response.url().includes("/cart") && response.ok(),
					)
				}

				expect(page.url()).toContain("/cart")
				await expect(page.getByTestId("cart-container")).toBeVisible()
			})
		})
	})
})
