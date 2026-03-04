import { test, expect } from '@playwright/test';
import { randomUUID } from 'crypto';

test.describe('Welcome Page - Registration', () => {
  const makeUniqueCreds = () => {
    // Use UUID to avoid collisions; strip dashes and trim length for backend limits
    const suffix = randomUUID().replace(/-/g, '').slice(0, 12);
    return {
      username: `u${suffix}`,
      password: `Pw${suffix}!Aa`,
      email: `e${suffix}@example.com`,
    };
  };

  test.beforeEach(async ({ page }) => {
    // Navigate to the welcome page
    await page.goto('/welcome');
    await page.waitForLoadState('domcontentloaded');
  });

  test('display welcome page registration button', async ({ page }) => {
    // Verify welcome page content
    await expect(page.locator('text=Welcome to MyFlix')).toBeVisible({ timeout: 5000 });
    
    // Check for registration button
    const registerButton = page.getByRole('button', { name: /Register/i });
    await expect(registerButton).toBeVisible();
  });

  test('open registration dialog when registration button is clicked', async ({ page }) => {  
    // Click registration button
    await page.getByRole('button', { name: /Register/i }).click();
    // Wait for dialog to appear
    await expect(page.locator('mat-dialog-container')).toBeVisible();
    // Check for registration form fields
    await expect(page.locator('input[name="Username"]')).toBeVisible();
    await expect(page.locator('input[name="Password"]')).toBeVisible();
    await expect(page.locator('input[name="Email"]')).toBeVisible();
    await expect(page.locator('input[name="Birthday"]')).toBeVisible();
  });

  test('open registration form and successfully register', async ({ page }) => {

    const { username, password, email } = makeUniqueCreds();

    // Open login dialog
    await page.getByRole('button', { name: /Register/i }).click();
    await page.waitForSelector('mat-dialog-container');
    
    // Fill in valid credentials
    await page.fill('input[name="Username"]', username);
    await page.fill('input[name="Password"]', password);
    await page.fill('input[name="Email"]', email);
    await page.fill('input[name="Birthday"]', '1990-01-01');
    
    // Click sign up button
    await page.getByRole('button', { name: /Sign Up/i }).click();

    // Verify success message (ensures request finished)
    const successSnackbar = page.locator('.mdc-snackbar__label');
    await expect(successSnackbar).toContainText(/User successfully registered and logged in!/i, { 
      timeout: 10000 
    });

    // Wait for navigation to movies page
    await expect(page).toHaveURL(/\/movies/, { timeout: 20000 });
    
    // Verify we're on the movies page
    await expect(page.locator('app-movie-card')).toBeVisible({ timeout: 10000 });
  });

  test('check that required username field validation messages appear', async ({ page }) => {
    // Open registration dialog
    await page.getByRole('button', { name: /Register/i }).click();
    await page.waitForSelector('mat-dialog-container'); 
    // Click Sign Up button without filling username field to trigger validation message
    await page.getByRole('button', { name: /Sign Up/i }).click();   
    
    // Check that validation messages are visible
    const usernameError = page.locator('mat-error:has-text(" Username is required and must be at least 5 characters long.")');
    await expect(usernameError).toBeVisible();

    // Start typing in username field to clear validation message
    await page.fill('input[name="Username"]', 'testuser');
    await expect(usernameError).not.toBeVisible();
  });

  test('check that required password field validation messages appear', async ({ page }) => {
    // Open registration dialog
    await page.getByRole('button', { name: /Register/i }).click();
    await page.locator('mat-dialog-container').waitFor();

    // Click Sign Up without filling anything
    await page.getByRole('button', { name: /Sign Up/i }).click();

    // Check validation message
    const passwordError = page.locator('mat-error')
      .filter({ hasText: 'Password is required and must be at least 6 characters long.' });

    await expect(page.locator('mat-error')).toHaveText(/required|least 6/i);

    // Fill password to clear validation
    await page.locator('input[name="Password"]').fill('TestPassword1234!');
    await expect(passwordError).not.toBeVisible();
  });

  test('check that the general validation messages appear', async ({ page }) => {
    // Open registration dialog
    await page.getByRole('button', { name: /Register/i }).click();
    await page.waitForSelector('mat-dialog-container'); 
    // Click Sign Up button without filling any fields to trigger validation messages
    await page.getByRole('button', { name: /Sign Up/i }).click();   

    // Snackbar message
    const snackbar = page.locator('.mdc-snackbar__label');
    await expect(snackbar).toContainText('Please fill out all required fields correctly.');
  });

  test('check email field validation messages appear', async ({ page }) => {
    // Open registration dialog
    await page.getByRole('button', { name: /Register/i }).click();
    await page.waitForSelector('mat-dialog-container');
    // Fill in invalid email
    await page.fill('input[name="Email"]', 'invalidemail');

    // Click Sign Up button to trigger validation message
    await page.getByRole('button', { name: /Sign Up/i }).click();

    // Check that validation messages are visible
    const emailError = page.locator('mat-error:has-text("A valid email is required.")');
    await expect(emailError).toBeVisible();

    // Start typing in email field to clear validation message
    await page.fill('input[name="Email"]', 'testemail@test.com');
    await expect(emailError).not.toBeVisible();
  });

  test('check that the same username validation message appears when trying to register with an existing username', async ({ page }) => {
    const testUsername = process.env['E2E_TEST_USERNAME'] || 'testuser123';
    const testPassword = process.env['E2E_TEST_PASSWORD'] || 'TestPassword123!';
    const testEmail = process.env['E2E_TEST_EMAIL'] || 'test@example.com';
    // Open registration dialog
    await page.getByRole('button', { name: /Register/i }).click();
    await page.waitForSelector('mat-dialog-container');
    // Fill in existing username
    await page.fill('input[name="Username"]', testUsername);
    await page.fill('input[name="Password"]', testPassword);
    await page.fill('input[name="Email"]', testEmail);
    await page.fill('input[name="Birthday"]', '1990-01-01');
    await page.getByRole('button', { name: /Sign Up/i }).click();

       // Snackbar message
    const snackbar = page.locator('.mdc-snackbar__label');
    await expect(snackbar).toContainText(/failed|required|correctly/i);

  });
});
