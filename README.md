[![CircleCI](https://dl.circleci.com/status-badge/img/circleci/DLLwkL1CoAZzRg2SSVD89o/BzX2Lsg6PXVq4JMjDPqFVa/tree/main.svg?style=svg)](https://dl.circleci.com/status-badge/redirect/circleci/DLLwkL1CoAZzRg2SSVD89o/BzX2Lsg6PXVq4JMjDPqFVa/tree/main)
# Playwright RMS Angular - Automation Framework

A comprehensive Playwright automation framework with TypeScript support for E2E, API, and smoke testing.

## 🚀 Project Structure

```
Playwright_RMS_Angular/
│
├── .github/workflows/      # CI/CD workflows (GitHub Actions)
├── e2e/                    # Main test directory (configured in playwright.config.ts)
├── tests/                  # Additional test specifications
│   ├── e2e/               # End-to-end tests
│   ├── api/               # API tests
│   └── smoke/             # Smoke tests
├── pages/                  # Page Object Models (POM)
├── fixtures/               # Test data and fixtures
├── utils/                  # Helper utilities and test setup
├── config/                 # Environment configurations
├── playwright-report/      # HTML test reports (auto-generated)
├── test-results/           # Test results and artifacts (auto-generated)
├── playwright.config.ts    # Playwright configuration
├── package.json           # Dependencies and scripts
└── tsconfig.json          # TypeScript configuration
```

## 📋 Prerequisites

- Node.js (v18 or higher - LTS recommended)
- npm (comes with Node.js)

## 🛠️ Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Install Playwright browsers:**
```bash
npx playwright install --with-deps
```
or
```bash
npm run install:browsers
```

This installs Chromium, Firefox, and WebKit browsers along with their system dependencies.

## 🧪 Running Tests

### Run All Tests (Headless)
```bash
npm test
```
or
```bash
npx playwright test
```

### Run Tests in Headed Mode (See Browser)
```bash
npm run test:headed
```
or
```bash
npx playwright test --headed
```

### UI Mode (Interactive Test Runner)
```bash
npm run test:ui
```
or
```bash
npx playwright test --ui
```

### Debug Mode (Step Through Tests)
```bash
npm run test:debug
```
or
```bash
npx playwright test --debug
```

### Run Tests on Specific Browsers
```bash
npm run test:chromium     # Chrome/Chromium only
npm run test:firefox      # Firefox only
npm⚙️ Configuration

### Playwright Configuration
The main configuration is in [`playwright.config.ts`](playwright.config.ts):
- Test directory: `./e2e`
- Browsers: Chromium, Firefox, WebKit
- Parallel execution enabled
- Retry on failure (2 retries in CI)
- HTML reporter with trace on first retry

### Environment Configuration

Set the `TEST_ENV` environment variable to switch between environments:

- `development` (default)
- `staging`
- `production`

Example:
```bash
# Windows (PowerShell)
$env:TEST_ENV="staging"; npm test

# Windows (CMD)
set TEST_ENV=staging && npm test

# Linux/Mac
TEST_ENV=staging npm test
```

### Base URL Configuration
Uncomment and set the `baseURL` in `playwright.config.ts`:
```typescript
use: {
  baseURL: 'http://localhost:4200',  // Your app URL
  trace: 'on-first-retry',
}e
```bash
npx playwright test tests/e2e/login.spec.ts
```

### Run Tests with Specific Tags
```bash
npx playwright test --grep @smoke
```

## 📊 View Test Reports
✍️ Writing Tests

### Page Object Model (POM) Pattern

Create reusable page classes in the `pages/` directory:

```typescript
// pages/LoginPage.ts
import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.locator('#email');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('button[type="submit"]');
  }

  async navigate() {
    await this.page.goto('/login');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}
```

### Writing Test Specs

Create test files in the `tests/` directory with `.spec.ts` extension:

```typescript
// tests/e2e/login.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';

test.describe('Login Tests', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigate();
  });

  test('should login successfully with valid credentials', async ({ page }) => {
    await loginPage.login('testuser@example.com', 'password123');
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test('should show error with invalid credentials', async () => {
    await loginPage.login('invalid@example.com', 'wrongpassword');
    await expect(loginPage.errorMessage).toBeVisible();
  });
});
```🔄 CI/CD Integration

### GitHub Actions
This project includes a GitHub Actions workflow (`.github/workflows/playwright.yml`) for automated testing.

**Workflow triggers:**
- Push to `main` or `master` branch
- Pull requests to `main` or `master` branch

**What it does:**
- Sets up Node.js LTS
- Installs dependencies
- Installs Playwright browsers with system dependencies
- Runs all Playwright tests
- Uploads test reports as artifacts (retained for 30 days)

**View Reports in GitHub Actions:**
1. Go to the Actions tab in your repository
2. Click on the workflow run
3. Download the `playwright-report` artifact
4. Extract and open `index.html`
import testData from '../../fixtures/testData.json';

test('should login with fixture data', async () => {
  await loginPage.login(testData.users.validUser.email, testData.users.validUser.password
export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.locator('#email');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    // Add more actions
  }
}
```

### Test Example

```typescript
imp📝 Best Practices

1. ✅ **Use Page Object Model (POM)** - Keep page interactions separate from test logic
2. ✅ **Keep tests independent** - Each test should run in isolation
3. ✅ **Use meaningful test descriptions** - Clear test names help identify failures
4. ✅ **Leverage fixtures** - Store test data in `fixtures/` directory
5. ✅ **Use proper selectors** - Prefer user-facing attributes (role, label, text)
6. ✅ **Wait for elements properly** - Use Playwright's auto-waiting features
7. ✅ **Handle test data** - Use environment configs for different environments
8. ✅ **Screenshots on failure** - Automatically captured (configured in `playwright.config.ts`)
9. ✅ **Use trace viewer** - Debug failed tests with trace files
10. ✅ **Parallel execution** - Tests run in parallel for faster execution

## 🐛 Debugging

###Push your changes and submit a pull request

## 📚 Resources

- [Playwright Documentation](https://playwright.dev/)
- [Playwright API Reference](https://playwright.dev/docs/api/class-playwright)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [VS Code Extension](https://playwright.dev/docs/getting-started-vscode)

## 📦 Dependencies

- **@playwright/test**: ^1.57.0 - Playwright Test framework
- **TypeScript**: ^5.3.0 - Type checking
- **@types/node**: ^20.10.0 - Node.js type definitions

## 🐞 Troubleshooting

### Browser Installation Issues
```bash
# Install with system dependencies
npx playwright install --with-deps

# Install specific browser
npx playwright install chromium
```

### Clear Cache
```bash
# Remove test results
rm -rf test-results/

# Remove Playwright cache
rm -rf playwright-report/
```

### Permission Issues (Linux/Mac)
```bash
# Make sure Node.js and npm are installed correctly
node --version
npm --version

# Install browsers with sudo if needed
sudo npx playwright install --with-deps
```

## 📄 License

ISC

---

**Last Updated**: January 2026  
**Playwright Version**: 1.57.0  
**Node Version**: 18+ (LTS recommended)

### VS Code Extension
Install the [Playwright Test for VS Code](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright) extension for:
- Run tests from the editor
- Debug with breakpoints
- View test results inline
- Record new tests

### Codegen - Record Tests
Generate tests by recording your actions:
```bash
npx playwright codegen http://localhost:4200
```

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run tests locally to ensure they passain/master branch

## Best Practices

1. Use Page Object Model pattern
2. Keep tests independent and isolated
3. Use meaningful test descriptions
4. Leverage fixtures for test data
5. Use environment configurations for different environments
6. Take screenshots/videos on failures
7. Use proper waits and assertions

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests locally
4. Submit a pull request

## License

ISC
