import { test, expect } from '@playwright/test';

test.describe('Smoke Tests', () => {
  test('should load home page successfully', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/.*Home.*/i);
  });

  test('should register a new user successfully', async ({ page }) => {
    await page.goto('/register');
    await page.fill('#email', 'test@t.com');
    await page.fill('#password', 'Password123!');
    await page.fill('#confirmPassword', 'Password123!');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/.*welcome/);
  });


  test('should login successfully', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Login');
    await expect(page).toHaveURL(/.*login/);
  });


});
