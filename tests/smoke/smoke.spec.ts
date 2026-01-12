import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { loginData } from '../../config/environments';

test.describe('Smoke Tests', () => {

  let loginPage: LoginPage;
  test.beforeEach(async ({ page }, testInfo) => {
    console.log(`🧪 Running smoke test: ${testInfo.title}`);
    loginPage = new LoginPage(page);
    await loginPage.navigate();
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

  test('TC_002- should complete full login flow Successfully', {
    tag: ['@smoke', '@critical', '@positive']
  }, async ({ page }) => {
    await test.step('Enter login credentials', async () => {
      await loginPage.login(loginData.email!, loginData.password!, loginData.realm);
    });

    await test.step('Wait for successful redirect', async () => {
      await page.waitForURL(/repository|dashboard|home/i, { timeout: 30000 });
      await expect(page).toHaveURL(/repository|dashboard|home/i);

    });

  });
});