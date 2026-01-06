import { Page, Locator, expect } from '@playwright/test';
import { getEnvironment, loginData } from '../config/environments';

const env = getEnvironment();

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

    constructor(page: Page) {
        this.page = page;
        
        // Email Form Elements
        this.emailInput = page.locator('#username');
        
        // Password Form Elements
        this.passwordInput = page.locator('#password');
        
        // Common Elements
        this.loginButton = page.locator('button[type="submit"], #kc-login');
        this.errorMessage = page.locator('#input-error-username, #input-error-password, .error-message');
        
        // Optional Elements
        this.realmDropdown = page.locator('#realm, select[name="realm"]');
        this.languageButton = page.locator('#kc-current-locale-link, button[aria-label*="language"]');
        this.eyeIcon = page.locator('.fa-eye, button[aria-label*="password"]');
        this.forgotPasswordLink = page.locator('text=Forgot Password, a[href*="forgot"]');
        this.restartLoginLink = page.locator('.kc-login-tooltip, a[href*="restart"]');
    }

    async navigate() {
        console.log('Navigating to:', process.env.BASE_URL);
        await this.page.goto(process.env.BASE_URL || '', { 
            timeout: env.timeout,
            waitUntil: 'domcontentloaded'
        });
        console.log('Page loaded. Current URL:', this.page.url());
    }

    async fillEmail(email: string) {
        await this.emailInput.waitFor({ state: 'visible', timeout: env.timeout });
        await this.emailInput.fill(email);
    }

    async fillPassword(password: string) {
        await this.passwordInput.waitFor({ state: 'visible', timeout: env.timeout });
        await this.passwordInput.fill(password);
    }

    async clickLoginButton() {
        await this.loginButton.click();
        await this.page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {}); 
    }

    async selectRealm(realmName: string) {
        const isVisible = await this.realmDropdown.isVisible().catch(() => false);
        
        if (isVisible) {
            await this.realmDropdown.selectOption({ label: realmName });
            console.log(`Realm "${realmName}" selected`);
        } else {
            console.log('Realm dropdown not visible - skipping realm selection');
        }
    }

    async verifyErrorMessage(expectedMessage: string) {
        await this.errorMessage.waitFor({ state: 'visible', timeout: 5000 });
        await expect(this.errorMessage).toContainText(expectedMessage);
    }

    async changeLanguage() {
        const isVisible = await this.languageButton.isVisible().catch(() => false);
        if (isVisible) {
            await this.languageButton.click();
        }
    }

    async togglePasswordVisibility() {
        const isVisible = await this.eyeIcon.isVisible().catch(() => false);
        if (isVisible) {
            await this.eyeIcon.click();
        }
    }



    async waitForPasswordInput() {
        await this.passwordInput.waitFor({ state: 'visible', timeout: env.timeout });
    }

    async login(email: string, password: string, realm?: string) {
        console.log('Starting login process...');
        
        // Step 1: Enter email
        console.log('Step 1: Filling email');
        await this.fillEmail(email);
        await this.clickLoginButton();
        
        // Step 2: Select realm if provided and visible
        if (realm) {
            console.log('Step 2: Checking for realm selection');
            await this.page.waitForTimeout(1000); // Wait for realm dropdown to appear
            await this.selectRealm(realm);
            
            const realmVisible = await this.realmDropdown.isVisible().catch(() => false);
            if (realmVisible) {
                await this.clickLoginButton();
            }
        }
        
        // Step 3: Enter password
        console.log('Step 3: Waiting for password input');
        await this.waitForPasswordInput();
        console.log('Step 4: Filling password');
        await this.fillPassword(password);
        await this.clickLoginButton();
        
        console.log('Login process completed');
    }
}