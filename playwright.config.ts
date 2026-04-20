import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";
dotenv.config({ quiet: true });

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    trace: "on-first-retry",
    baseURL:
      process.env.BASE_URL ??
      "https://demo.medusajs.com/",
    storageState: 'tests/medusa/.auth/user.json',
  },
  projects: [
    { name: 'setup', testMatch: /.*\.setup\.ts/ },
    {
      name: "chromium",
      testIgnore: "tests/oAuth/oAuth.spec.ts",
      use: {
        ...devices["Desktop Chrome"],
      },
      dependencies: ['setup'],
    },
    {
      name: "iphone",
      testIgnore: "tests/oAuth/oAuth.spec.ts",
      use: {
        ...devices["iPhone 14"],
        isMobile: true,
      },
      dependencies: ['setup'],
    },
    {
      name: "oAuth",
      testMatch: "tests/oAuth/oAuth.spec.ts",
			use: {
        ...devices["Desktop Chrome"],
        baseURL: process.env.AUTH0_DOMAIN ?? "https://dev-l6iqq0v7n4m5f6zz.us.auth0.com/",
			},
		},
	],
});
