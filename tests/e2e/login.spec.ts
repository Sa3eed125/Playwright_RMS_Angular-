import dotenv from 'dotenv';
dotenv.config();
import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { loginData } from '../../config/environments';


test.describe('Login Tests', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigate();
  });
  // Full Flow Tests
  test('should complete full login flow Successfully', async ({ page }) => {
    await loginPage.login(loginData.email!, loginData.password!, loginData.realm);
    
    // Wait for authentication to complete and redirect to repository
    await page.waitForURL(/repository|dashboard|home/i, { timeout: 30000 });
    
    // Verify we reached the expected page
    await expect(page).toHaveURL(/repository|dashboard|home/i);
    console.log('Login completed. Current URL:', page.url());
  });

  // Email Input Step Tests
  test('should navigate to password input when valid email is entered', async ({ page }) => {

    await loginPage.login(loginData.email!, loginData.password!, loginData.realm);

    // Add assertion to verify successful login
    await page.waitForTimeout(2000);
    console.log('Current URL:', page.url());
  });

  test('should show error when invalid email format is entered', async ({ page }) => {
    await loginPage.fillEmail('invalidemailformat');
    await loginPage.clickLoginButton();
    await page.waitForTimeout(1000);
    await loginPage.verifyErrorMessage('Invalid username or email.');
    await page.waitForTimeout(1000);
    console.log('Current URL after error:', page.url());

  });

  test('should show error when empty email is submitted', async ({ page }) => {
    await loginPage.fillEmail('');
    await loginPage.clickLoginButton();
    await loginPage.verifyErrorMessage('Invalid username or email.');
    await page.waitForTimeout(1000);
    console.log('Current URL after error:', page.url());
  });

  test('should not proceed to next step with unregistered email', async ({ page }) => {
    await loginPage.fillEmail('unregistered@test.com');
    await loginPage.clickLoginButton();
    await loginPage.verifyErrorMessage('Invalid username or email.');
    await page.waitForTimeout(1000);
    console.log('Current URL after error:', page.url());
  });

  // Realm Selection Tests (for users with multiple realms)
  test('should display realm dropdown when email is registered on multiple realms', async ({ page }) => {
    await loginPage.fillEmail(process.env.TEST_EMAIL || '');
    await loginPage.clickLoginButton();
    await page.waitForTimeout(1000);
    await expect(loginPage.realmDropdown).toBeVisible();
  });

  test('should navigate to password input after selecting realm', async ({ page }) => {
    await loginPage.fillEmail(process.env.TEST_EMAIL || '');
    await loginPage.clickLoginButton();
    await loginPage.selectRealm(process.env.TEST_REALM || '');
    await loginPage.clickLoginButton();
    await expect(loginPage.passwordInput).toBeVisible();
  });

  // Password Input Step Tests

  /*
    test('should show error with incorrect password', async ({ page }) => {
      await loginPage.fillEmail(loginData.email);
      await loginPage.clickLoginButton();
      await loginPage.selectRealm(loginData.realm);
      await loginPage.clickLoginButton();
      await loginPage.fillPassword('wrongpassword');
      await loginPage.clickLoginButton();
      await loginPage.verifyErrorMessage('Invalid credentials');
    });
  
    // Eye Icon Tests
    test('should toggle password visibility when eye icon is clicked', async ({ page }) => {
      await loginPage.fillEmail(loginData.email);
      await loginPage.clickLoginButton();
      await loginPage.selectRealm(loginData.realm);
      await loginPage.clickLoginButton();
      await loginPage.togglePasswordVisibility();
      const inputType = await loginPage.passwordInput.getAttribute('type');
      expect(inputType).toBe('text');
    });
  
    // Restart Login Link Tests
    test('should navigate back to email input when restart login link is clicked', async ({ page }) => {
      await loginPage.fillEmail(loginData.email);
      await loginPage.clickLoginButton();
      await loginPage.restartLoginLink.click();
      await expect(loginPage.emailInput).toBeVisible();
    });
  

    */
});