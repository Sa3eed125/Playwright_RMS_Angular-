import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',

  /* Run tests in files in parallel */
  fullyParallel: false,  // Disable full parallelism to avoid test interference

  /* Test timeout */
  timeout: 90000,  // 90 seconds per test
  //workers: process.env.CI ? 1 : undefined,  // 
   
  workers: 1,  // Disable parallelism to avoid test interference

  // Reporter configuration - HTML report updates automatically
  reporter: [
    [
      'html',
      {
        outputFolder: 'playwright-report',
        open: 'never', // Change to 'always' to open after each run
      },
    ],
    ['list'], // Console output
    ['json', { outputFile: 'test-results/results.json' }],
  ],

  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    baseURL: process.env.BASE_URL || 'http://localhost:4200',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
