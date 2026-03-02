import { test as base, Page } from '@playwright/test';

/**
 * Test user credentials for E2E tests.
 * 
 * Credentials are loaded from environment variables in the following order:
 * 1. Environment variables from GitHub Actions (CI)
 * 2. Variables from .env file (local development)
 * 3. Fallback defaults (if no env vars are set)
 * 
 * For local development, create a .env file with your test credentials:
 * E2E_TEST_USERNAME=testuser
 * E2E_TEST_PASSWORD=TestPassword123!
 * E2E_TEST_EMAIL=testuser@example.com
 * 
 * For CI, set these as repository secrets in GitHub Actions.
 */
export const TEST_USER = {
  username: process.env['E2E_TEST_USERNAME'] || 'testuser',
  password: process.env['E2E_TEST_PASSWORD'] || 'TestPassword123!',
  email: process.env['E2E_TEST_EMAIL'] || 'testuser@example.com',
  birthday: '1990-01-15',
};

/**
 * Extended test fixtures for authenticated user context.
 */
type AuthFixtures = {
  authenticatedPage: Page;
};

/**
 * Fixture to provide an authenticated page with user logged in via API.
 * This is faster than using the UI for login in every test.
 */
export const test = base.extend<AuthFixtures>({
  authenticatedPage: async ({ page }, use) => {
    // Navigate to the app
    await page.goto('/');

    // Wait for app to load
    await page.waitForLoadState('networkidle');

    // Perform login via API to set up authentication state
    const loginResponse = await page.request.post(
      'https://movie-api-eqfh.vercel.app/login',
      {
        data: {
          Username: TEST_USER.username,
          Password: TEST_USER.password,
        },
      }
    );

    if (loginResponse.ok()) {
      const loginData = await loginResponse.json();
      
      // Set user data and token in localStorage
      await page.evaluate((data) => {
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('token', data.token);
      }, loginData);

      // Reload page to apply auth state
      await page.reload();
      await page.waitForLoadState('networkidle');
    }

    // Use the authenticated page in the test
    await use(page);

    // Cleanup
    await page.evaluate(() => {
      localStorage.clear();
    });
  },
});

export { expect } from '@playwright/test';
