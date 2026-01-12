import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { loginData } from '../../config/environments';

test.describe('Smoke Tests', () => {
  test.describe.configure({
    mode: 'serial',
    timeout: 120000
  });

  let loginPage: LoginPage;

  test.beforeEach(async ({ page }, testInfo) => {
    console.log(`🧪 Running smoke test: ${testInfo.title}`);
    loginPage = new LoginPage(page);
  });

  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status === 'passed') {
      console.log(`✅ ${testInfo.title} - PASSED`);
    } else {
      console.log(`❌ ${testInfo.title} - FAILED`);
      await page.screenshot({
        path: `test-results/smoke-${testInfo.title.replace(/[^a-z0-9]/gi, '_')}.png`,
        fullPage: true
      });
    }
  });

  test('SMOKE_001 - Application should be accessible', {
    tag: ['@smoke', '@critical', '@health-check']
  }, async ({ page }) => {
    await test.step('Navigate to application URL', async () => {
      await loginPage.navigate();
    });

    await test.step('Verify page loads successfully', async () => {
      await page.waitForLoadState('domcontentloaded', { timeout: 30000 });
      await expect(page).toHaveURL(/login|signin|auth|csp/i);
    });

    await test.step('Verify page is interactive', async () => {
      await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {
        console.log('⚠️ Network idle timeout, but page is loaded');
      });
    });
  });

  test('SMOKE_002 - User authentication should work end-to-end', {
    tag: ['@smoke', '@critical', '@e2e', '@auth']
  }, async ({ page }) => {
    await test.step('Navigate to login page', async () => {
      await loginPage.navigate();
      await page.waitForLoadState('domcontentloaded');
    });

    await test.step('Perform login with valid credentials', async () => {
      await loginPage.login(
        process.env.TEST_EMAIL || loginData.email!,
        process.env.TEST_PASSWORD || loginData.password!,
        process.env.TEST_REALM || loginData.realm
      );
    });

    await test.step('Verify successful authentication', async () => {
      await page.waitForURL(/repository|dashboard|home/i, { timeout: 30000 });
      await expect(page).toHaveURL(/repository|dashboard|home/i);
    });

    await test.step('Verify post-login page loads', async () => {
      await page.waitForLoadState('domcontentloaded');
      const url = page.url();
      expect(url).not.toContain('login');
      expect(url).not.toContain('error');
    });
  });
});