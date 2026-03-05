import { test, expect } from '../fixtures/auth.fixture';
import { randomUUID } from 'crypto';

test.describe('User Profile Management', () => {

  const makeUniqueCreds = () => {
    const suffix = randomUUID().replace(/-/g, '').slice(0, 12);
    return {
      username: `u${suffix}`
    };
  };

  test('display user profile page with account details', async ({ authenticatedPage: page }) => {
    // Navigate to profile page
    await page.goto('/profile');
    await expect(page.locator('app-root')).toBeVisible();

    // Verify profile section headings
    await expect(page.locator('h1')).toHaveText(/Your Favorite Movies/i);
    await expect(page.locator('h2')).toHaveText(/Update your account:/i);
  });

  test('display user account form with editable fields', async ({ authenticatedPage: page }) => {
    // Navigate to profile page
    await page.goto('/profile');
    await expect(page.locator('app-root')).toBeVisible();

    // Verify form fields are visible
    const usernameInput = page.locator('input[name="Username"]');
    const emailInput = page.locator('input[name="Email"]');
    const passwordInput = page.locator('input[name="Password"]');
    const birthdayInput = page.locator('input[name="Birthday"]');

    await expect(usernameInput).toBeVisible();
    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(birthdayInput).toBeVisible();

    // Verify buttons are present
    const updateButton = page.getByRole('button', { name: /update account/i });
    await expect(updateButton).toBeVisible();

    const deleteButton = page.getByRole('button', { name: /delete account/i });
    await expect(deleteButton).toBeVisible();
  });

  test('update user account information', async ({ authenticatedPage: page }) => {
    // Navigate to profile page
    await page.goto('/profile');
    await expect(page.locator('app-root')).toBeVisible();
  
    const testPassword = process.env['E2E_TEST_PASSWORD'] || 'TestPassword123!';
    await page.fill('input[name="Password"]', testPassword);
  
    // Update email
    const emailInput = page.locator('input[name="Email"]');
    await emailInput.fill('newemail@example.com');
  
    // Click update button
    const updateButton = page.getByRole('button', { name: /update account/i });
  
    await expect(updateButton).toBeVisible();
    await expect(updateButton).toBeEnabled();
    await updateButton.scrollIntoViewIfNeeded();
  
    await updateButton.click();
  
    // Verify success message
    const successSnackbar = page.locator('.mdc-snackbar__label');
    await expect(successSnackbar).toContainText(/successfully updated/i, {
      timeout: 10000,
    });
  });

  test('show validation errors when updating with invalid data', async ({ authenticatedPage: page }) => {
    // Navigate to profile page
    await page.goto('/profile');
    await expect(page.locator('app-root')).toBeVisible();

    const testPassword = process.env['E2E_TEST_PASSWORD'] || 'TestPassword123!';
    await page.fill('input[name="Password"]', testPassword);

    // Try to set invalid email format
    const emailInput = page.locator('input[name="Email"]');
    await emailInput.click({ clickCount: 3 });
    await emailInput.fill('invalid-email');

    // Try to update
    const updateButton = page.getByRole('button', { name: /update account/i });
    await updateButton.click();

    const errorSnackbar = page.locator('.mdc-snackbar__label');
    await expect(errorSnackbar).toContainText(/Error:/i, { 
      timeout: 10000 
    });
  });

  test('toggle password visibility', async ({ authenticatedPage: page }) => {
    // Navigate to profile page
    await page.goto('/profile');
    await expect(page.locator('app-root')).toBeVisible();

    const passwordInput = page.locator('input[name="Password"]');

    const testPassword = process.env['E2E_TEST_PASSWORD'] || 'TestPassword123!';
    await page.fill('input[name="Password"]', testPassword);
    
    // Check initial type (be password)
    let inputType = await passwordInput.getAttribute('type');
    expect(inputType).toBe('password');

      // Click visibility toggle button
    await page.getByRole('button').filter({ hasText: 'visibility_off' }).click();
    await page.getByRole('button').filter({ hasText: 'visibility' }).click();
  });

  test('open delete confirmation dialog', async ({ authenticatedPage: page }) => {
    // Navigate to profile page
    await page.goto('/profile');
    await expect(page.locator('app-root')).toBeVisible();

    // Click delete button
    const deleteButton = page.getByRole('button', { name: /delete account/i });
    await deleteButton.click({ timeout: 10000 });

    // Verify confirmation dialog appears
    const confirmDialog = page.locator('mat-dialog-container');
    await expect(confirmDialog).toBeVisible({ timeout: 110000 });

    // Verify dialog content
    await expect(confirmDialog.locator('text=Delete Account')).toBeVisible();
    await expect(confirmDialog.locator('text=Are you absolutely sure')).toBeVisible();
  });

  test('cancel delete operation from confirmation dialog', async ({ authenticatedPage: page }) => {
    // Navigate to profile page
    await page.goto('/profile');
    await expect(page.locator('app-root')).toBeVisible();

    // Click delete button
    const deleteButton = page.getByRole('button', { name: /delete account/i });
    await deleteButton.click({ timeout: 10000 });

    // Wait for dialog
    await expect(page.locator('mat-dialog-container')).toBeVisible({ timeout: 10000 });

    // Click cancel button
    const cancelButton = page.locator('button:has-text("Cancel")');
    await cancelButton.click();

    // Dialog close
    await expect(page.locator('mat-dialog-container')).not.toBeVisible();

    // still be on profile page
    await expect(page.locator('app-user-profile')).toBeVisible();
  });

  test('navigate back from profile page', async ({ authenticatedPage: page }) => {
    // Navigate to profile page
    await page.goto('/profile');
    await expect(page.locator('app-root')).toBeVisible();

    // Look for close button (usually in top of profile)
    const closeButton = page.locator('button[aria-label*="close" i]').first();
    
    if (await closeButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await closeButton.click();
      
      // navigate to movies
      await page.waitForURL('**/movies', { timeout: 10000 });
    }
  });

  test('create new user account and delete it', async ({ page }) => {

    const { username } = makeUniqueCreds();

    await page.goto('/welcome');
    await expect(page.locator('app-root')).toBeVisible();
    await expect(page.locator('text=Welcome to MyFlix')).toBeVisible({ timeout: 10000 });
      
    // Check for registration button
    const registerButton = page.getByRole('button', { name: /Register/i });
    await expect(registerButton).toBeVisible();  

    // Open login dialog
    await page.getByRole('button', { name: /Register/i }).click();
    await page.waitForSelector('mat-dialog-container');
    
    // Fill in valid credentials
    await page.fill('input[name="Username"]', username);
    await page.fill('input[name="Password"]', 'TestPassword12345!');
    await page.fill('input[name="Email"]', 'testuser@example.com');
    await page.fill('input[name="Birthday"]', '1990-01-01');
 
    // Click sign up button
    await page.getByRole('button', { name: /Sign Up/i }).click();
    
    // Verify we're on the movies page
    await expect(page.locator('[data-testid^="movie-"]').first()).toBeVisible({ timeout: 60000 });
    
    // Verify success message appeared
    const successSnackbar = page.locator('.mdc-snackbar__label');
    await expect(successSnackbar).toContainText(/ User successfully registered and logged in!/i, { 
      timeout: 10000 
    });
    
    await page.goto('/profile');
    await expect(page.locator('app-root')).toBeVisible();

    // Click delete button
    const deleteButton = page.getByRole('button', { name: /delete account/i });
    await deleteButton.click({ timeout: 10000 });

    // Wait for dialog
    await expect(page.locator('mat-dialog-container')).toBeVisible({ timeout: 10000 });

    // Click cancel button
    const deleteaccountButton = page.getByRole('button', { name: /Delete/i });
    await deleteaccountButton.click();

    // Verify success message appeared
    const deleteSnackbar = page.locator('.mdc-snackbar__label');
    await expect(deleteSnackbar).toContainText(/ User successfully deleted/i, { 
      timeout: 10000 
    });
 });
});
