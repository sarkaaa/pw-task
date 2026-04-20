import { expect, Locator, Page } from "@playwright/test";
import { PRODUCTS } from "../../fixtures/medusa/products";

/**
 * Expected prices low to high. Mainly used for sorting checks.
 */
export const expectedPricesLowToHigh = (expectedSorted: { name: string; price: string }[]): string[] => {
  return expectedSorted
    .map((item) => item.price)
    .sort(
      (a: string, b: string) =>
        Number(a.replace("$", "")) - Number(b.replace("$", "")),
    );
};

/**
 * Checks if the product title and price are the same as the expected product title and price.
 */
export const checkProductTitlePricePair = async (cartItem: Locator) => {
  const foundProductTitle = await cartItem.getByTestId("product-title").textContent()

  const productItem = await PRODUCTS.find((item) => item.name === foundProductTitle)
  
  if (!productItem) {
    throw new Error(`Product item not found for title: ${foundProductTitle}`);
  }
  await expect(cartItem.getByTestId("product-title")).toHaveText(productItem?.name ?? "");
  await expect(cartItem.getByTestId("price")).toHaveText(productItem?.price ?? "");
}

/**
 * Waits for the sort response and checks if the first item price is the same as the expected first item price.
 */
export const waitForSortResponse = async (page: Page, param: string, firstItemPrice: string) => {
  const sortResponse = page.waitForResponse(
    (response) =>
      response.url().includes(param) && response.ok(),
  )
  await sortResponse;

  // Wait for the first item price to be the same as the expected first item price
  await expect(
    page.getByTestId("product-wrapper").first().getByTestId("price"),
  ).toHaveText(firstItemPrice)

  return;
}

/**
 * Checks if the sorted prices are the same as the expected sorted prices.
 */
export const checkSortedPrices = async (page: Page, expectedSorted: string[]) => {
  const cartItems = await page.getByTestId("product-wrapper").all()
  const sortedPrices: string[] = []

  for (const cartItem of cartItems) {
    await checkProductTitlePricePair(cartItem)
    sortedPrices.push(
      (await cartItem.getByTestId("price").textContent()) ?? "",
    )
  }

  return expect(sortedPrices).toEqual(expectedSorted)
}
