import dotenv from 'dotenv';
dotenv.config();
import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { loginData } from '../../config/environments';
import { invalidEmails, invalidPasswords } from '../../fixtures/LoginInvalidData.json';

test.describe('Login Tests', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }, testInfo) => {
    console.log(`\n🧪 Running: ${testInfo.title}`);
    loginPage = new LoginPage(page);
    await loginPage.navigate();
  });

  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status === 'passed') {
      console.log(`✅ ${testInfo.title} - PASSED`);
    } else {
      console.log(`❌ ${testInfo.title} - FAILED`);
      await page.screenshot({
        path: `test-results/screenshots/${testInfo.title.replace(/[^a-z0-9]/gi, '_')}.png`,
        fullPage: true
      });
    }
  });

  // Valid Login Tests - Full Flow and Element Verification
  test.describe('Valid Login Tests', () => {
    test.describe.configure({ mode: 'parallel' });

    // Full Flow Tests
    test('TC_001- should complete full login flow Successfully', {
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

    // Realm Selection Tests (for users with multiple realms)
    test('TC_002- should display realm dropdown when email is registered on multiple realms', {
      tag: ['@realm', '@positive']
    }, async ({ page }) => {
      await test.step('Enter email and submit', async () => {
        await loginPage.fillEmail(process.env.TEST_EMAIL || '');
        await loginPage.clickLoginButton();
      });

      await test.step('Verify realm dropdown appears', async () => {
        await expect(loginPage.realmDropdown).toBeVisible();
      });
    });

    // Verify Login Page Elements
    test('TC_003- should display all login page elements correctly', {
      tag: ['@ui', '@positive']
    }, async ({ page }) => {
      await loginPage.assertLoginElements(loginData.email);
    });

    // Verify Realm Selection Page Elements
    test('TC_004- should display all realm selection page elements correctly', {
      tag: ['@ui', '@realm', '@positive']
    }, async ({ page }) => {
      await loginPage.assertRealmElements(loginData.email, loginData.realm);
    });

    // Password Input Step 

    // Verify Password Input Page Elements
    test('TC_005- should display all password input page elements correctly', {
      tag: ['@ui', '@password', '@positive']
    }, async ({ page }) => {
      await loginPage.assertPasswordElements(loginData.email, loginData.realm, loginData.password);
    });

    // Eye Icon functionality 
    test('TC_006- should toggle password visibility when eye icon is clicked', {
      tag: ['@ui', '@password', '@positive']
    }, async ({ page }) => {
      await test.step('Navigate to password page', async () => {
        await loginPage.assertPasswordElements(loginData.email, loginData.realm, loginData.password);
      });

      await test.step('Show password', async () => {
        await loginPage.eyeIcon.click();
        const passwordType = await loginPage.passwordInput.getAttribute('type');
        expect(passwordType).toBe('text');
      });

      await test.step('Hide password', async () => {
        await loginPage.eyeIcon.click();
        const passwordTypeHidden = await loginPage.passwordInput.getAttribute('type');
        expect(passwordTypeHidden).toBe('password');
      });
    });

    // Restart Login Link Tests
    test('TC_007- should navigate back to email input when restart login link is clicked', {
      tag: ['@ui', '@navigation', '@known-issue'],
      annotation: { type: 'issue', description: 'Restart link not working properly' }
    }, async ({ page }) => {
      test.fixme(); // Mark as known issue

      await test.step('Navigate to password page', async () => {
        await loginPage.assertPasswordElements(loginData.email, loginData.realm, loginData.password);
      });

      await test.step('Click restart login link', async () => {
        await loginPage.restartLoginLink.click();
      });

      await test.step('Verify back to email input', async () => {
        await expect(loginPage.emailInput).toBeVisible();
      });
    });

    // Change Language functionality
    test('TC_008- should change language when language button is clicked', {
      tag: ['@ui', '@i18n', '@known-issue'],
      annotation: { type: 'issue', description: 'Language change not working properly' }
    }, async ({ page }) => {
      test.fixme(); // Mark as known issue

      await test.step('Navigate to password page', async () => {
        await loginPage.assertPasswordElements(loginData.email, loginData.realm, loginData.password);
      });

      await test.step('Click language button', async () => {
        await loginPage.languageButton.click();
      });

      await test.step('Verify language changed', async () => {
        await expect(loginPage.emailInput).toBeVisible();
        await expect(loginPage.loginHeader).not.toHaveText('Enter your password');
      });
    });

    // Forgot Password Link functionality  
    test('TC_009- should navigate to forgot password page when forgot password link is clicked', {
      tag: ['@password', '@navigation', '@positive']
    }, async ({ page }) => {
      await test.step('Navigate to password page', async () => {
        await loginPage.assertPasswordElements(loginData.email, loginData.realm, loginData.password);
      });

      await test.step('Click forgot password link', async () => {
        await loginPage.forgotPasswordLink.click();
      });

      await test.step('Verify forgot password page', async () => {
        await expect(page).toHaveURL(/forgot-password|reset-password|reset-credentials/i);
        await expect(loginPage.loginHeader).toHaveText(/Forgot Your Password?/i);
      });

      await test.step('Verify page elements', async () => {
        await expect.soft(loginPage.emailInput).toBeVisible();
        await expect.soft(loginPage.forgotPasswordLink).toBeVisible();
        await expect.soft(loginPage.forgotPasswordLink).toContainText(/Back to Login/i);
      });
    });
  });

  // Invalid Emails - Each email as separate test case
  test.describe('Invalid Email Tests', () => {
    test.describe.configure({ mode: 'parallel', retries: 1 });

    invalidEmails.forEach((item: any, index: number) => {
      test(`TC_${10 + index + 1}- should reject invalid email: ${item.description}`, {
        tag: ['@negative', '@email', '@validation']
      }, async ({ page }) => {
        await test.step('Enter invalid email', async () => {
          await loginPage.fillEmail(item.email);
          await loginPage.clickLoginButton();
          await page.waitForTimeout(1500);
        });

        await test.step('Verify error message', async () => {
          await expect(loginPage.errorMessage).toBeVisible();
          await expect(loginPage.errorMessage).toContainText(
            item.errorMessage || 'Invalid username or email.'
          );
        });
      });
    });
  });

  // Invalid Passwords - Each password as separate test case
  test.describe('Invalid Password Tests', () => {
    test.describe.configure({ mode: 'serial', retries: 1 });

    invalidPasswords.forEach((item: any, index: number) => {
      test(`TC_${20 + index + 1}- should reject invalid password: ${item.description}`, {
        tag: ['@negative', '@password', '@validation']
      }, async ({ page }) => {
        await test.step('Navigate to password step', async () => {
          await loginPage.fillEmail(loginData.email!);
          await loginPage.clickLoginButton();
          await loginPage.selectRealm(loginData.realm!);
          await loginPage.clickLoginButton();
          await loginPage.waitForPasswordInput();
        });

        await test.step('Enter invalid password', async () => {
          await loginPage.fillPassword(item.password);
          await loginPage.clickLoginButton();
          await page.waitForTimeout(1500);
        });

        await test.step('Verify error message', async () => {
          await expect(loginPage.errorMessage).toBeVisible();
          await expect(loginPage.errorMessage).toContainText(
            item.errorMessage || 'Invalid password.'
          );
        });
      });
    });
  });
});