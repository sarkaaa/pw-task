# About
This project is an end-to-end test suite for the [Medusa.js demo store](https://demo.medusajs.com), built with [Playwright](https://playwright.dev). It runs tests across Chrome Desktop and iPhone, and is integrated with GitHub Actions for continuous testing on every push and pull request.

![image](https://img.shields.io/badge/Playwright-2EAD33?style=for-the-badge&logo=playwright&logoColor=white)
![image](https://img.shields.io/badge/Allure-E35205?style=for-the-badge&logo=allure&logoColor=white)
![image](https://img.shields.io/badge/Commitlint-F05032?style=for-the-badge&logo=commitlint&logoColor=white)
![image](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![image](https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=githubactions&logoColor=white)
![image](https://img.shields.io/badge/Biome-60A5FA?style=for-the-badge&logo=biome&logoColor=white)
![image](https://img.shields.io/badge/Husky-333333?style=for-the-badge&logo=husky&logoColor=white)

## Prerequisites
- Node.js (v18 or higher)
- pnpm (comes with Node.js)

## Installation
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

4. Run tests:

Headless mode:

```
pnpm test
```

UI mode:
```
pnpm run test:ui
```

## Tools

1. **Biome** - enforces code quality (e.g. no unused variables, required imports, no unnecessary awaits,...).
2. **Husky** - runs Biome and Commitlint when commit is triggered.
3. **Commitlint** - helps to keep commit structure.
4. **GitHub actions** - runs e2e tests in GitHub repository.

## CI: Allure reports

After tests finish (pass or fail), the workflow generates an Allure report when `allure-results/` is present. **`playwright-report`** and **`allure-report`** are uploaded as GitHub Actions artifacts (30-day retention).

**Optional:** [`scripts/allure-index.mjs`](scripts/allure-index.mjs) can build a simple `index.html` for multiple local `runs/` folders if you host reports yourself.

## Directory structure 📁

```
pw-task/
├── .github/
│   └── workflows/
│       └── playwright.yml       # CI pipeline
├── fixtures/
│   └── userData.ts              # Test data (users, addresses, etc.)
├── pages/
│   └── LoginPage.ts             # Page Object for the login page
├── playwright/
│   └── .auth/
│       └── user.json            # Saved authentication state
├── tests/
│   ├── auth.setup.ts            # Authentication setup (global setup)
│   ├── account.spec.ts          # Account management tests
│   └── loginUI.spec.ts          # Login UI tests
├── scripts/
│   └── allure-index.mjs         # Optional: index.html for multiple local runs/
├── utils/
│   └── loginError.spec.ts       # Login error message helpers
├── .env.example                 # Environment variables template
├── biome.json                   # Biome linter/formatter config
├── commitlint.config.mjs        # Commitlint config
├── package.json
└── playwright.config.ts         # Playwright configuration
```
