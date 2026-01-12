import { Page, Locator, expect } from '@playwright/test';
import { getEnvironment, loginData } from '../config/environments';
import { Console } from 'console';

const env = getEnvironment();
const TIMEOUTS = {
    SHORT: 2000,
    MEDIUM: 10000,
    LONG: env.timeout
} as const;

export class LoginPage {
    readonly page: Page;
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;
    readonly errorMessage: Locator;
    readonly realmDropdown: Locator;
    readonly languageButton: Locator;
    readonly eyeIcon: Locator;
    readonly forgotPasswordLink: Locator;
    readonly restartLoginLink: Locator;
    readonly loginHeader: Locator;
    readonly realmLabel: Locator;
    readonly emailInPasswordInput: Locator;

    constructor(page: Page) {
        this.page = page;

        // Email Form Elements
        this.emailInput = page.locator('#username');
        this.loginHeader = page.locator('#kc-page-title');


        // Password Form Elements
        this.passwordInput = page.locator('#password');

        // Common Elements
        this.loginButton = page.locator('button[type="submit"], #kc-login');
        this.errorMessage = page.locator('#input-error-username, #input-error-password, .error-message');

        // Optional Elements
        this.realmDropdown = page.locator('#realm, select[name="realm"]');
        this.languageButton = page.locator('#kc-current-locale-link, button[aria-label*="language"]');
        this.eyeIcon = page.locator('button[aria-label="Show password"], button[aria-label="Hide password"]');
        this.forgotPasswordLink = page.locator('#kc-form-options');
        this.restartLoginLink = page.locator('.kc-login-tooltip, a[href*="restart"]');
        this.realmLabel = page.locator('label[for="realm"], label[for="select-realm"]');
        this.emailInPasswordInput = page.locator('#kc-attempted-username');
    }

    /**
     * Navigate to the login page
     */
    async navigate(): Promise<void> {
        console.log('Navigating to:', process.env.BASE_URL);
        await this.page.goto(process.env.BASE_URL || '', {
            timeout: TIMEOUTS.LONG,
        });
    }
        
      

    /**
     * Fill email input field with enhanced CI stability
     */
    async fillEmail(email: string): Promise<void> {
        // Wait for email input with extended timeout for CI (20 seconds)
        await this.emailInput.waitFor({ 
            state: 'visible', 
            timeout: 20000
        });
        
        // Ensure input is attached and enabled
        await this.emailInput.waitFor({ 
            state: 'attached', 
            timeout: TIMEOUTS.MEDIUM 
        });
        
        // Additional check: ensure element is enabled
        const isEnabled = await this.emailInput.isEnabled();
        if (!isEnabled) {
            console.log('⚠️ Email input is not enabled, waiting...');
            await this.page.waitForTimeout(1000);
        }
        
        await this.emailInput.fill(email);
    }

    /**
     * Fill password input field with enhanced CI stability
     */
    async fillPassword(password: string): Promise<void> {
        // Wait for password input with extended timeout for CI (20 seconds)
        await this.passwordInput.waitFor({ 
            state: 'visible', 
            timeout: 20000
        });
        
        // Ensure input is attached and enabled
        await this.passwordInput.waitFor({ 
            state: 'attached', 
            timeout: TIMEOUTS.MEDIUM 
        });
        
        // Additional check: ensure element is enabled
        const isEnabled = await this.passwordInput.isEnabled();
        if (!isEnabled) {
            console.log('⚠️ Password input is not enabled, waiting...');
            await this.page.waitForTimeout(1000);
        }
        
        await this.passwordInput.fill(password);
    }

    /**
     * Click login/submit button
     */
    async clickLoginButton(): Promise<void> {
        await this.loginButton.click();
        await this.page.waitForLoadState('domcontentloaded', { timeout: TIMEOUTS.MEDIUM }).catch(() => { });
    }

    /**
     * Select realm from dropdown if visible
     */
    async selectRealm(realmName: string): Promise<boolean> {
        const isVisible = await this.realmDropdown.isVisible().catch(() => false);

        if (isVisible) {
            try {
                await this.realmDropdown.selectOption({ label: realmName });
                console.log(`Realm "${realmName}" selected`);
                await this.page.waitForTimeout(TIMEOUTS.SHORT);
                return true;
            } catch (error) {
                console.warn(`Failed to select realm "${realmName}", trying by value...`);
                await this.realmDropdown.selectOption({ value: realmName });
                return true;
            }
        }

        console.log('Realm dropdown not visible - skipping realm selection');
        return false;
    }

    /**
     * Verify error message is displayed
     */
    async verifyErrorMessage(expectedMessage: string): Promise<void> {
        await this.errorMessage.waitFor({ state: 'visible', timeout: TIMEOUTS.SHORT });
        await expect(this.errorMessage).toContainText(expectedMessage);
    }

    /**
     * Change language if button is available
     */
    async changeLanguage(): Promise<void> {
        const isVisible = await this.languageButton.isVisible().catch(() => false);
        if (isVisible) {
            await this.languageButton.click();
        }
    }

    /**
     * Toggle password visibility
     */
    async togglePasswordVisibility(): Promise<void> {
        const isVisible = await this.eyeIcon.isVisible().catch(() => false);
        if (isVisible) {
            await this.eyeIcon.click();
        }
    }

    /**
     * Wait for password input to become visible
     */
    async waitForPasswordInput(): Promise<void> {
        await this.passwordInput.waitFor({ state: 'visible', timeout: TIMEOUTS.LONG });
    }

    // Complete login process
    async login(email: string, password: string, realm?: string): Promise<void> {
        try {

            // Step 1: Enter valid email
            console.log('Step 1: Filling email');
            await this.fillEmail(email);
            await this.clickLoginButton();
            console.log('Email submitted successfully');

            // Step 2: Select realm if provided
            if (realm) {
                console.log('Step 2: Selecting realm:', realm);
                const realmSelected = await this.selectRealm(realm);
                await this.page.waitForTimeout(TIMEOUTS.SHORT);
                console.log(`Realm "${realm}" selected successfully`);
                if (realmSelected) {
                    await this.clickLoginButton();
                }
            }

            // Step 3: Wait for password input
            console.log('Step 3: Waiting for password input');
            await this.waitForPasswordInput();
            // Step 4: Enter valid password
            console.log('Step 4: Filling password');
            await this.fillPassword(password);
            await this.clickLoginButton();
            console.log('Login process completed');
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    }

    // Assertion of Login Elements for Visual Verification
    async assertLoginElements(email?: string): Promise<void> {
        await this.fillEmail(email || ' ');
        await expect(this.page).toHaveURL(/login|signin|auth/i);
        console.log('On Login Page. Current URL:', this.page.url());
        await expect(this.loginHeader).toBeVisible();
        console.log('Login Header Text:', await this.loginHeader.textContent());
        await expect(this.loginHeader).toHaveText("Sign in to your account");
        console.log('Login Header verified');
        await expect(this.emailInput).toBeVisible();
        console.log('Email Input is visible');
        await expect(this.loginButton).toBeVisible();
        console.log('Login Button is visible');
        console.log('Login page elements verified successfully');
    }

    // Assertion of Realm Elements for Visual Verification
    async assertRealmElements(email?: string, realm?: string): Promise<void> {
        await this.fillEmail(email || ' ');
        console.log('Filling email for realm selection verification');
        await this.clickLoginButton();
        console.log('Navigated to realm selection step');
        await this.selectRealm(realm || '');
        console.log('Selected realm for verification');
        await expect(this.loginHeader).toHaveText("Sign in to your account");
        console.log('On Realm Selection Page. Current URL:', this.page.url());
        await expect(this.realmLabel).toBeVisible();
        console.log('Realm Label is visible');
        await expect(this.realmLabel).toHaveText("Realm");
        console.log('Realm Label text verified');
        await expect(this.realmDropdown).toBeVisible();
        console.log('Realm Dropdown is visible');
        await expect(this.loginButton).toBeVisible();
        console.log('Login Button is visible');

        console.log('Realm selection elements verified successfully');
    }

    // Assertion of Password Elements for Visual Verification
    async assertPasswordElements(email?: string, realm?: string, password?: string): Promise<void> {
        await this.fillEmail(email || ' ');
        console.log('Filling email for password input verification');
        await this.clickLoginButton();
        await this.selectRealm(realm || '');
        console.log('Selected realm for password input verification');
        await this.clickLoginButton();
        console.log('Navigated to password input step');
        await this.fillPassword(password || ' ');
        console.log('Filling password for verification');
        await expect(this.page).toHaveURL(/password|signin|auth/i);
        console.log('On Password Input Page. Current URL:', this.page.url());
        await expect(this.passwordInput).toBeVisible();
        console.log('Password Input is visible');
        await expect(this.eyeIcon).toBeVisible();
        console.log('Eye Icon is visible');
        await expect(this.forgotPasswordLink).toBeVisible();
        console.log('Forgot Password Link is visible');
        await expect(this.loginButton).toBeVisible();
        await expect(this.emailInPasswordInput).toBeVisible();
        await expect(this.emailInPasswordInput).toContainText(email || '');
        console.log('Email display in Password Input is visible');
        console.log('Login Button is visible');
        await expect(this.languageButton).toBeVisible();
        console.log('Language Button is visible');
        console.log('Password input elements verified successfully');
    }
}