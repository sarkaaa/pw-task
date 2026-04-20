import type { Locator, Page } from "@playwright/test";

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly signInButton: Locator;
  readonly errorMessage: Locator;
  readonly registerButton: Locator;
  readonly overviewPageWrapper: Locator;
  readonly mobileAccountNavigation: Locator;
  readonly desktopAccountNavigation: Locator;
  readonly registerPage: Locator;
  readonly signInFromRegisterButton: Locator;
  readonly loginPage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByTestId("email-input");
    this.passwordInput = page.getByTestId("password-input");
    this.signInButton = page.getByTestId("sign-in-button");
    this.errorMessage = page.getByTestId("login-error-message");
    this.registerButton = page.getByTestId("register-button");
    this.overviewPageWrapper = page.getByTestId("overview-page-wrapper");
    this.mobileAccountNavigation = page.getByTestId("mobile-account-nav");
    this.desktopAccountNavigation = page.getByTestId("account-nav");
    this.registerPage = page.getByTestId("register-page");
    this.signInFromRegisterButton = page.getByRole("button", {
      name: "Sign in",
    });
    this.loginPage = page.getByTestId("login-page");
  }

  async goto() {
    await this.page.goto("/account");
  }

  /**
   * Fills credentials, submits the form, and waits for a successful profile response.
   * Use for happy-path login assertions.
   */
  async login(email: string, password: string) {
    if (!email || !password) {
      throw new Error("EMAIL or PASSWORD is not set")
    }
    
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.signInButton.click();
    await this.page.waitForResponse(
      (response) =>
        response.url().includes("account/profile") && response.ok(),
    );
  }

  /**
   * Fills credentials and submits the form without waiting for a success response.
   * Use when expecting an error state after submission.
   */
  async attemptLogin(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.signInButton.click();
  }

  async clickRegister() {
    await this.registerButton.click();
  }

  async clickSignInFromRegister() {
    await this.signInFromRegisterButton.click();
  }
}
