import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { loginData } from '../../config/environments';

test.describe('Smoke Tests', () => {
  
  test('should login successfully', async ({ page }) => {
    // Increase timeout for CI environment
    test.setTimeout(120000); // 2 minutes
    
    const loginPage = new LoginPage(page);
    
    // Navigate to login page
    await loginPage.navigate();
    
    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {
      console.log('Network idle timeout, but continuing...');
    });
    
    // Perform login
    await loginPage.login(process.env.TEST_EMAIL || '', process.env.TEST_PASSWORD || '', process.env.TEST_REALM || '');
    
    // Verify successful login by checking URL contains expected path
    await expect(page).toHaveURL(/repository|dashboard|home/i, { timeout: 30000 });
    
    console.log('✓ Login smoke test passed. Current URL:', page.url());
  });

  test('should display login page elements', async ({ page }) => {
    test.setTimeout(60000); // 1 minute
    
    const loginPage = new LoginPage(page);
    
    // Navigate to login page
    await loginPage.navigate();
    
    // Wait for page load
    await page.waitForLoadState('domcontentloaded');
    
    // Verify essential page elements are visible
    await expect(loginPage.emailInput).toBeVisible({ timeout: 20000 });
    await expect(loginPage.loginButton).toBeVisible({ timeout: 20000 });
    
    console.log('✓ Login page elements smoke test passed');
  });
});