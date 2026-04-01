import { expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";

export const showLoginError = async ({ loginPage }: { loginPage: LoginPage }) => {
  const ERROR_MESSAGE = "Error: Invalid email or password";
  await expect(loginPage.errorMessage).toHaveText(ERROR_MESSAGE);
}
