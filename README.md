# About

This repository stands as a sandbox for multiple projects for my experimental purposes.

![image](https://img.shields.io/badge/Playwright-2EAD33?style=for-the-badge&logo=playwright&logoColor=white)
![image](https://img.shields.io/badge/Commitlint-F05032?style=for-the-badge&logo=commitlint&logoColor=white)
![image](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![image](https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=githubactions&logoColor=white)
![image](https://img.shields.io/badge/Biome-60A5FA?style=for-the-badge&logo=biome&logoColor=white)
![image](https://img.shields.io/badge/Husky-333333?style=for-the-badge&logo=husky&logoColor=white)

### Medusa
This project is an end-to-end test suite for the [Medusa.js demo store](https://demo.medusajs.com), built with [Playwright](https://playwright.dev). It runs tests across Chrome Desktop and iPhone, and is integrated with GitHub Actions for continuous testing on every push and pull request.

### OAuth
This project implements an end-to-end test for the [OAuth 2.0 Authorization Code flow with PKCE](https://auth0.com/docs/get-started/authentication-and-authorization-flow/authorization-code-flow-with-pkce). It verifies the full flow — from constructing the authorization URL and completing the Auth0 login form, to exchanging the authorization code for tokens and asserting a valid `access_token` is returned.

![PKCE flow](https://mintlify.s3.us-west-1.amazonaws.com/auth0/docs/images/cdy7uua7fh8z/3pstjSYx3YNSiJQnwKZvm5/33c941faf2e0c434a9ab1f0f3a06e13a/auth-sequence-auth-code-pkce.png "Authorization Code flow for OAuth")
*Source: [Authorization Code Flow with Proof Key for Code Exchange (PKCE)](https://auth0.com/docs/get-started/authentication-and-authorization-flow/authorization-code-flow-with-pkce)*

## Prerequisites
- Node.js (v20 or higher)
- pnpm

## Installation ⚙️
1. Clone repository:
```bash
git clone git@github.com:sarkaaa/pw-task.git
```

2. Install dependencies:
```bash
pnpm install --frozen-lockfile
```

3. Install Playwright browsers:
```bash
pnpm exec playwright install
```

4. Copy `.env.example` to `.env` and fill in your credentials:
```bash
cp .env.example .env
```

## Environment variables - Medusa Store

| Variable   | Description                          |
|------------|--------------------------------------|
| `BASE_URL` | Target URL (defaults to demo store)  |
| `EMAIL`    | Account email for authentication     |
| `PASSWORD` | Account password for authentication  |

## Environment variables - OAuth

| Variable             | Description                                      |
|----------------------|--------------------------------------------------|
| `AUTH0_DOMAIN`       | Auth0 tenant domain (e.g. `dev-xxx.auth0.com`)   |
| `AUTH0_CLIENT_ID`    | Auth0 application client ID                      |
| `AUTH0_USERNAME`     | Auth0 test user email                            |
| `AUTH0_PASSWORD`     | Auth0 test user password                         |
| `AUTH0_REDIRECT_URI` | Allowed callback URI registered in Auth0         |

## Running tests

Headless mode:
```bash
pnpm test
```

Run single test file:
```bash
pnpm test <path-to-testfile>
# Example: pnpm test tests/oAuth/oAuth.spec.ts 
```

Run group of tests with a specifig tag:
```bash
pnpm test --grep <tagname>
# Example: pnpm test --grep @oauth
```


UI mode:
```bash
pnpm test:ui
```

## Authentication

### Medusa
`tests/medusa/auth.setup.ts` runs before the Medusa test projects. It logs in with `EMAIL` and `PASSWORD`, then saves the session to `tests/medusa/.auth/user.json`. All subsequent Medusa tests reuse that saved state, so the login form is only hit once per run.

### OAuth
The OAuth project (`tests/oAuth/oAuth.spec.ts`) does not rely on saved state — it executes a full PKCE flow from scratch each run.

## CI

Tests run on every push to `master` and on every pull request. After the run, the **playwright-report** artifact is uploaded to GitHub Actions.

**GitHub secrets:** `EMAIL`, `PASSWORD`, `AUTH0_CLIENT_ID`, `AUTH0_USERNAME`, `AUTH0_PASSWORD`, `AUTH0_REDIRECT_URI`

**GitHub variables:** `BASE_URL`, `AUTH0_DOMAIN`

## Tools

1. **Biome** — linter and formatter; enforces code quality on every commit via Husky.
2. **Husky** — runs Biome and Commitlint as pre-commit hooks.
3. **Commitlint** — enforces conventional commit message format.
4. **GitHub Actions** — runs the full E2E suite in CI.

## Directory structure 📁

```
pw-task/
├── .github/
│   └── workflows/
│       └── playwright.yml       # CI pipeline
├── fixtures/
│   └── medusa/
│       ├── products.ts          # Static product test data
│       └── userData.ts          # Static user / address test data
├── pages/
│   └── medusa/
│       └── LoginPage.ts         # Page Object for the login / account page
├── scripts/
│   └── allure-index.mjs         # Optional: builds index.html for local Allure runs/
├── tests/
│   ├── medusa/
│   │   ├── .auth/
│   │   │   └── user.json        # Saved authentication state (git-ignored)
│   │   ├── auth.setup.ts        # Medusa auth setup (runs before chromium & iphone projects)
│   │   ├── cart.spec.ts         # Cart and product tests
│   │   └── login.spec.ts        # Login UI tests
│   └── oAuth/
│       └── oAuth.spec.ts        # OAuth 2.0 PKCE flow test
├── utils/
│   ├── medusa/
│   │   ├── loginError.ts        # Login error assertion helper
│   │   └── sortPrices.ts        # Price sorting helpers
│   ├── oauth/
│   │   └── generatePKCE.ts      # PKCE verifier / challenge generator
│   └── general.ts               # Shared helpers (requireEnv)
├── .env.example                 # Environment variables template
├── biome.json                   # Biome linter/formatter config
├── commitlint.config.mjs        # Commitlint config
├── package.json
└── playwright.config.ts         # Playwright configuration
```
