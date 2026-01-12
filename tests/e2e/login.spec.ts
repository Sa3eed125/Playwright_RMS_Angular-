import dotenv from 'dotenv';
dotenv.config();
import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { loginData } from '../../config/environments';
import { invalidEmails, invalidPasswords } from '../../fixtures/LoginInvalidData.json';

test.describe('Login Tests', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigate();
  });

  /*
    * Valid Data Tests
    */
  // Full Flow Tests
  test('TC_001- should complete full login flow Successfully', async ({ page }) => {
    await loginPage.login(loginData.email!, loginData.password!, loginData.realm);

    // Wait for authentication to complete and redirect to repository
    await page.waitForURL(/repository|dashboard|home/i, { timeout: 30000 });

    // Verify we reached the expected page
    await expect(page).toHaveURL(/repository|dashboard|home/i);
    console.log('Login completed. Current URL:', page.url());
  });

  // Realm Selection Tests (for users with multiple realms)
  test('TC_002- should display realm dropdown when email is registered on multiple realms', async ({ page }) => {
    await loginPage.fillEmail(process.env.TEST_EMAIL || '');
    await loginPage.clickLoginButton();
    await expect(loginPage.realmDropdown).toBeVisible(); // Verify realm dropdown is visible
    console.log('Realm dropdown is displayed for multiple realms.');
  });

  // Verify Login Page Elements
  test('TC_003- should display all login page elements correctly', async ({ page }) => {
    await loginPage.assertLoginElements(loginData.email);
  });

  // Verify Realm Selection Page Elements
  test('TC_004- should display all realm selection page elements correctly', async ({ page }) => {
    await loginPage.assertRealmElements(loginData.email, loginData.realm);
  });

  // Password Input Step 

  // Verify Password Input Page Elements
  test('TC_005- should display all password input page elements correctly', async ({ page }) => {
    await loginPage.assertPasswordElements(loginData.email, loginData.realm, loginData.password);
  });

  // Eye Icon functionality 
  test('TC_006- should toggle password visibility when eye icon is clicked', async ({ page }) => {
    await loginPage.assertPasswordElements(loginData.email, loginData.realm, loginData.password);
    await loginPage.eyeIcon.click();
    // Verify password is visible
    const passwordType = await loginPage.passwordInput.getAttribute('type');
    expect(passwordType).toBe('text');
    console.log('Password visibility toggled to visible.');
    await loginPage.eyeIcon.click();
    // Verify password is hidden again
    const passwordTypeHidden = await loginPage.passwordInput.getAttribute('type');
    expect(passwordTypeHidden).toBe('password');
    console.log('Password visibility toggled back to hidden.');
  });

  // Restart Login Link Tests   -- this test case will be faild because of restart link is not working
  test('TC_007- should navigate back to email input when restart login link is clicked', async ({ page }) => {
    await loginPage.assertPasswordElements(loginData.email, loginData.realm, loginData.password);
    await loginPage.restartLoginLink.click();
    console.log('Clicked on Restart Login link.');
    // Verify navigation back to email input page
    await expect(loginPage.emailInput).toBeVisible();
    console.log('Navigated back to email input page after clicking restart login link.');

  });

  // Change Language functionality   --- this test case will be faild because of language dosen't change
  test('TC_008- should change language when language button is clicked', async ({ page }) => {
    await loginPage.assertPasswordElements(loginData.email, loginData.realm, loginData.password);
    await loginPage.languageButton.click();
    console.log('Clicked on Language button.');
    // Verify navigation back to email input page
    await expect(loginPage.emailInput).toBeVisible();
    console.log('Navigated back to email input page after clicking restart login link.');
    // Additional verification of language change
    await expect(loginPage.loginHeader).not.toHaveText('Enter your password');
    console.log('Language changed successfully on login page.');
  });

  // Forgot Password Link functionality  
  test('TC_009- should navigate to forgot password page when forgot password link is clicked', async ({ page }) => {
    await loginPage.assertPasswordElements(loginData.email, loginData.realm, loginData.password);
    await loginPage.forgotPasswordLink.click();
    console.log('Clicked on Forgot Password link.');
    // Verify navigation to forgot password page
    await expect(page).toHaveURL(/forgot-password|reset-password|reset-credentials/i);
    console.log('Navigated to Forgot Password page. Current URL:', page.url());
    await expect(loginPage.loginHeader).toHaveText(/Forgot Your Password?/i);
    console.log('Forgot Password page header verified.');
    await expect(loginPage.emailInput).toBeVisible();
    console.log('Email input is visible on Forgot Password page.');
    await expect(loginPage.forgotPasswordLink).toBeVisible();
    await expect(loginPage.forgotPasswordLink).toContainText(/Back to Login/i);
    console.log('Forgot Password link is visible on Forgot Password page.');
  });

  /*
    * Invalid Data Tests
    */

  // Invalid Emails - Each email as separate test case
  test.describe('Invalid Email Tests', () => {
    invalidEmails.forEach((item: any, index: number) => {
      test(`TC_${10 + index + 1}- should reject invalid email: ${item.description}`, async ({ page }) => {
        await loginPage.fillEmail(item.email);
        await loginPage.clickLoginButton();
        await page.waitForTimeout(1500);
        await loginPage.verifyErrorMessage(item.errorMessage || 'Invalid username or email.');
        console.log(`✓ Email rejected: ${item.email} - ${item.description}`);
      });
    });
  });

  // Invalid Passwords - Each password as separate test case
  test.describe('Invalid Password Tests', () => {
    invalidPasswords.forEach((item: any, index: number) => {
      test(`TC_${20 + index + 1}- should reject invalid password: ${item.description}`, async ({ page }) => {
        // Navigate to password step first
        await loginPage.fillEmail(loginData.email!);
        await loginPage.clickLoginButton();
        await loginPage.selectRealm(loginData.realm!);
        await loginPage.clickLoginButton();
        await loginPage.waitForPasswordInput();

        // Test the invalid password
        await loginPage.fillPassword(item.password);
        await loginPage.clickLoginButton();
        await page.waitForTimeout(1500);
        await loginPage.verifyErrorMessage(item.errorMessage || 'Invalid password.');
        console.log(`✓ Password rejected: ${item.password} - ${item.description}`);
      });
    });
  });
});