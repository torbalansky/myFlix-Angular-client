import { test, expect } from '@playwright/test';
import * as exp from 'constants';

test.describe('Welcome Page - Login & Registration', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the welcome page
    await page.goto('/welcome');
    await page.waitForLoadState('domcontentloaded');
  });

  test('display welcome page with login and registration buttons', async ({ page }) => {
    // Verify welcome page content
    await expect(page.locator('text=Welcome to MyFlix')).toBeVisible({ timeout: 5000 });
    
    // Check for login button
    const loginButton = page.getByRole('button', { name: /Register/i });
    await expect(loginButton).toBeVisible();
    
    // Check for registration button
    const registerButton = page.getByRole('button', { name: /Register/i });
    await expect(registerButton).toBeVisible();
  });

  test('open login dialog when login button is clicked', async ({ page }) => {
    // Click login button
    await page.getByRole('button', { name: /login/i }).click();
    
    // Wait for dialog to appear
    await expect(page.locator('mat-dialog-container')).toBeVisible();
    
    // Check for login form fields
    await expect(page.locator('input[name="Username"]')).toBeVisible();
    await expect(page.locator('input[name="Password"]')).toBeVisible();
  });

  test('show error on failed login with invalid credentials', async ({ page }) => {
    // Open login dialog
    await page.getByRole('button', { name: /login/i }).click();
    await page.waitForSelector('mat-dialog-container');
    
    // Fill in invalid credentials
    await page.fill('input[name="Username"]', 'invaliduser');
    await page.fill('input[name="Password"]', 'wrongpassword');
    
    // Click login button
    await page.getByRole('button', { name: /login/i }).click();
    
    // Expect error message - snackbar appear at top
    const errorSnackbar = page.locator('.mdc-snackbar__label');
    await expect(errorSnackbar).toContainText(/Invalid username or password/i, { 
      timeout: 5000 
    });
  });

  test('successfully login with valid credentials', async ({ page }) => {
    const testUsername = process.env['E2E_TEST_USERNAME'] || 'testuser';
    const testPassword = process.env['E2E_TEST_PASSWORD'] || 'TestPassword123!';

    // Open login dialog
    await page.getByRole('button', { name: /login/i }).click();
    await page.waitForSelector('mat-dialog-container');
    
    // Fill in valid credentials
    await page.fill('input[name="Username"]', testUsername);
    await page.fill('input[name="Password"]', testPassword);
    
    // Click login button
    await page.getByRole('button', { name: /login/i }).click();
    
    // Verify we're on the movies page
    await expect(page.locator('app-movie-card')).toBeVisible({ timeout: 15000 });
    
    // Verify success message appeared
    const successSnackbar = page.locator('.mdc-snackbar__label');
    await expect(successSnackbar).toContainText(/Logged in successfully/i, { 
      timeout: 5000 
    });
  });

  test('show validation error when login form is incomplete', async ({ page }) => {
    await page.getByRole('button', { name: /login/i }).click();
    await page.locator('mat-dialog-container').waitFor();

    const username = page.locator('input[name="Username"]');
    const password = page.locator('input[name="Password"]');

    // Focus then blur username
    await username.focus();
    await page.keyboard.press('Tab');

    // Focus then blur password
    await password.focus();
    await page.keyboard.press('Tab');

    await expect(
      page.locator('mat-error').filter({ hasText: 'Username is required.' })
    ).toBeVisible();

    await expect(
      page.locator('mat-error').filter({ hasText: 'Password is required.' })
    ).toBeVisible();
  });

  test('close login dialog when cancel button is clicked', async ({ page }) => {
    // Open login dialog
    await page.getByRole('button', { name: /login/i }).click();
    await expect(page.locator('mat-dialog-container')).toBeVisible();
    
    await page.getByRole('button', { name: /X/i }).click();

    await expect(page.locator('text=Welcome to MyFlix')).toBeVisible({ timeout: 5000 });
  });
});
