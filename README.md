# About
This project is an end-to-end test suite for the [Medusa.js demo store](https://demo.medusajs.com), built with [Playwright](https://playwright.dev). It runs tests across Chrome Desktop and iPhone, and is integrated with GitHub Actions for continuous testing on every push and pull request.

![image](https://img.shields.io/badge/Playwright-2EAD33?style=for-the-badge&logo=playwright&logoColor=white)
![image](https://img.shields.io/badge/Commitlint-F05032?style=for-the-badge&logo=commitlint&logoColor=white)
![image](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![image](https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=githubactions&logoColor=white)
![image](https://img.shields.io/badge/Biome-60A5FA?style=for-the-badge&logo=biome&logoColor=white)
![image](https://img.shields.io/badge/Husky-333333?style=for-the-badge&logo=husky&logoColor=white)

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

## Environment variables

| Variable   | Required | Description                          |
|------------|----------|--------------------------------------|
| `BASE_URL` | No       | Target URL (defaults to demo store)  |
| `EMAIL`    | Yes      | Account email for authentication     |
| `PASSWORD` | Yes      | Account password for authentication  |

## Running tests

Headless mode:
```bash
pnpm test
```

UI mode:
```bash
pnpm test:ui
```

## Authentication

`tests/auth.setup.ts` runs before all test projects. It logs in with `EMAIL` and `PASSWORD`, then saves the session to `tests/.auth/user.json`. All subsequent tests reuse that saved state, so the login form is only hit once per run.

## CI

Tests run on every push to `master` and on every pull request. After the run, the **playwright-report** artifact is uploaded to GitHub Actions (30-day retention).

Required GitHub secrets: `EMAIL`, `PASSWORD`  
Optional GitHub variable: `BASE_URL`

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
│   ├── products.ts              # Static product test data
│   └── userData.ts              # Static user / address test data
├── pages/
│   └── LoginPage.ts             # Page Object for the login / account page
├── scripts/
│   └── allure-index.mjs         # Optional: builds index.html for local Allure runs/
├── tests/
│   ├── .auth/
│   │   └── user.json            # Saved authentication state (git-ignored)
│   ├── auth.setup.ts            # Global auth setup
│   ├── account.spec.ts          # Account management tests
│   ├── cart.spec.ts             # Cart and product tests
│   ├── checkout.spec.ts         # Checkout tests
│   └── login.spec.ts            # Login UI tests
├── utils/
│   ├── general.ts               # Shared helpers (requireEnv, etc.)
│   ├── loginError.ts            # Login error assertion helper
│   └── sortPrices.ts            # Price sorting helpers
├── .env.example                 # Environment variables template
├── biome.json                   # Biome linter/formatter config
├── commitlint.config.mjs        # Commitlint config
├── package.json
└── playwright.config.ts         # Playwright configuration
```
