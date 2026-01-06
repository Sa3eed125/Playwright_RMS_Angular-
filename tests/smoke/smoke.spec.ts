import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { loginData } from '../../config/environments';

test.describe('Smoke Tests', () => {
  
  test('should login successfully', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    // Navigate to login page
    await loginPage.navigate();
    
    // Perform login
    await loginPage.login(loginData.email, loginData.password, loginData.realm);
    
    // Verify successful login by checking URL contains expected path
    await expect(page).toHaveURL(/repository|dashboard|home/i, { timeout: 15000 });
    
    console.log('✓ Login smoke test passed. Current URL:', page.url());
  });
});