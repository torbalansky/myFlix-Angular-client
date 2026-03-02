# MyFlix E2E Testing Guide

This document provides comprehensive instructions for setting up, running, and maintaining Playwright E2E tests for the MyFlix Angular application.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running Tests](#running-tests)
- [Test Structure](#test-structure)
- [CI/CD Integration](#cicd-integration)
- [Environment Variables](#environment-variables)
- [Debugging Tests](#debugging-tests)
- [Best Practices](#best-practices)

## Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher
- A running instance of the MyFlix API (https://movie-api-eqfh.vercel.app/)
- Valid test user credentials for the API

## Installation

### 1. Install Playwright and Dependencies

```bash
npm install -D @playwright/test playwright
npx playwright install
```

### 2. Verify Installation

```bash
npx playwright --version
```

## Configuration

### Playwright Config (playwright.config.ts)

The main configuration file controls:
- Test directory location (`tests/specs`)
- Base URL for the application
- Browser targets (Chromium, Firefox, WebKit, Mobile)
- Timeouts and retries
- Reporter formats (HTML, GitHub Actions, JUnit)
- Video/screenshot/trace recording

**Key settings:**
- **baseURL**: Defaults to `http://localhost:4200` (can be overridden with `BASE_URL` env var)
- **retries**: 0 locally, 2 on CI (GitHub Actions)
- **workers**: Auto locally, 1 on CI
- **timeout**: 30 seconds per test
- **expect timeout**: 5 seconds

### Test User Credentials

Tests use a dedicated test user. Credentials are stored as GitHub Secrets:

**Required secrets** (set in GitHub repository settings):
- `E2E_TEST_USERNAME`: Username for test account
- `E2E_TEST_PASSWORD`: Password for test account
- `E2E_TEST_EMAIL`: Email for test account

**Local development**: Create a `.env.local` file (not committed):
```
E2E_TEST_USERNAME=testuser
E2E_TEST_PASSWORD=TestPassword123!
E2E_TEST_EMAIL=testuser@example.com
```

## Running Tests

### Local Testing

#### Run all tests
```bash
npm run test:e2e
```

#### Run tests in headed mode (see browser)
```bash
npm run test:e2e:headed
```

#### Run tests in UI mode (interactive)
```bash
npm run test:e2e:ui
```

#### Debug a specific test
```bash
npx playwright test tests/specs/login.spec.ts --debug
```

#### Run tests in a specific browser
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

#### Run a specific test file
```bash
npx playwright test tests/specs/login.spec.ts
```

#### Run tests matching a pattern
```bash
npx playwright test -g "login"
```

### View Test Results

After running tests, view the HTML report:
```bash
npm run test:e2e:report
```

Or:
```bash
npx playwright show-report
```

## Test Structure

### Directory Layout

```
tests/
├── fixtures/
│   └── auth.fixture.ts       # Shared fixtures and helpers
├── specs/
│   ├── login.spec.ts         # Login and registration tests
│   ├── movies.spec.ts        # Movie browsing tests
│   ├── favorites.spec.ts     # Favorite movies tests
│   └── profile.spec.ts       # User profile tests
└── data/
    └── (test data files, if needed)
```

### Test Files

#### login.spec.ts
Tests for user authentication:
- Display login/registration buttons
- Open login dialog
- Failed login with invalid credentials
- Successful login with valid credentials
- Form validation
- Dialog close/cancel

#### movies.spec.ts
Tests for movie browsing:
- Display movie list
- View movie details
- Search/filter movies
- Navigate back

#### favorites.spec.ts
Tests for favorite movies:
- Add movie to favorites
- Remove movie from favorites
- Display favorites in profile
- Verify empty state

#### profile.spec.ts
Tests for user profile:
- Display profile information
- Update account details
- Password visibility toggle
- Delete account confirmation
- Navigation

### Fixtures (auth.fixture.ts)

Provides reusable test fixtures:

**TEST_USER**: Default test credentials
```typescript
const TEST_USER = {
  username: process.env.E2E_TEST_USERNAME || 'testuser',
  password: process.env.E2E_TEST_PASSWORD || 'TestPassword123!',
  email: process.env.E2E_TEST_EMAIL || 'testuser@example.com',
  birthday: '1990-01-15',
};
```

**authenticatedPage**: Custom fixture that logs in a user via API before each test
```typescript
test('should display profile', async ({ authenticatedPage: page }) => {
  await page.goto('/profile');
  // ... test continues
});
```

## CI/CD Integration

### GitHub Actions Workflow

**File**: `.github/workflows/e2e-tests.yml`

**Triggers**:
- Pushes to `main` and `develop` branches
- Pull requests to `main` and `develop` branches

**What It Does**:
1. Checks out the code
2. Sets up Node.js 18.x
3. Installs dependencies (`npm ci`)
4. Builds the Angular app
5. Installs Playwright browsers
6. Runs all E2E tests with retries (2 retries on CI)
7. Uploads test artifacts:
   - HTML report
   - JUnit XML results
   - Videos (on failure)
   - Trace files (on failure)
8. Publishes results to GitHub Actions UI

### Setting Up GitHub Secrets

1. Go to your GitHub repository
2. Navigate to **Settings → Secrets and variables → Actions**
3. Create the following secrets:
   - `E2E_TEST_USERNAME`
   - `E2E_TEST_PASSWORD`
   - `E2E_TEST_EMAIL`

### Viewing CI Results

After a workflow run:
1. Go to the **Actions** tab in your GitHub repository
2. Click on the recent workflow run
3. Scroll down to see artifacts:
   - **playwright-report-18.x**: HTML report with full details
   - **junit-results-18.x**: JUnit XML for integration with other tools
   - **playwright-videos-18.x**: Recorded videos of failed tests (if available)
   - **playwright-traces-18.x**: Trace files for debugging (if available)

## Environment Variables

### Setup Overview

The project uses `.env` files to manage sensitive test credentials. The environment variable loading follows this priority:

1. **GitHub Actions CI**: Uses repository secrets
2. **Local .env file**: `.env` file in project root
3. **Fallback defaults**: Hardcoded defaults in test fixtures

### Local Development

#### Create .env file for local testing

Copy the `.env.example` file to `.env` and update with your test credentials:

```bash
# Copy template to actual file
cp .env.example .env
```

Then edit `.env` with your test account credentials:

```env
# Test User Credentials (used for E2E testing)
E2E_TEST_USERNAME=your_test_username
E2E_TEST_PASSWORD=your_test_password
E2E_TEST_EMAIL=your_test_email@example.com

# Base URL for the app (local development)
BASE_URL=http://localhost:4200

# MyFlix API Base URL
VITE_API_URL=https://movie-api-eqfh.vercel.app/
```

#### Never commit .env files

The `.env` file is automatically excluded from git via `.gitignore`. It contains sensitive credentials and **must never be committed** to version control.

```gitignore
# From .gitignore
.env
.env.local
.env.*.local
```

#### Optional: Use .env.local for multiple environments

For multiple test environments, create `.env.local`:

```bash
# This overrides settings in .env
E2E_TEST_USERNAME=alternate_test_user
BASE_URL=http://staging-server:4200
```

### CI Environment (GitHub Actions)

Repository secrets are configured separately and are **not** stored in .env files.

**To set up CI secrets**:

1. Go to your GitHub repository
2. Navigate to **Settings → Secrets and variables → Actions**
3. Create the following secrets:
   - `E2E_TEST_USERNAME`: Your test account username
   - `E2E_TEST_PASSWORD`: Your test account password
   - `E2E_TEST_EMAIL`: Your test account email

The GitHub Actions workflow reads these secrets as environment variables at runtime:

```yaml
env:
  E2E_TEST_USERNAME: ${{ secrets.E2E_TEST_USERNAME }}
  E2E_TEST_PASSWORD: ${{ secrets.E2E_TEST_PASSWORD }}
  E2E_TEST_EMAIL: ${{ secrets.E2E_TEST_EMAIL }}
```

### How Environment Variables Are Loaded

The `playwright.config.ts` file automatically loads environment variables using dotenv:

```typescript
import dotenv from 'dotenv';
import path from 'path';

// Load from .env file first, then .env.local (overrides)
dotenv.config({ path: path.resolve(__dirname, '.env') });
dotenv.config({ path: path.resolve(__dirname, '.env.local') });
```

Test fixtures then access these variables:

```typescript
export const TEST_USER = {
  username: process.env['E2E_TEST_USERNAME'] || 'testuser',
  password: process.env['E2E_TEST_PASSWORD'] || 'TestPassword123!',
  email: process.env['E2E_TEST_EMAIL'] || 'testuser@example.com',
  birthday: '1990-01-15',
};
```

## Debugging Tests

### Enable Debug Mode

```bash
npx playwright test --debug
```

This opens the Playwright Inspector with step-by-step debugging.

### View Test Traces

Traces are automatically recorded on first retry failure. To view:

```bash
npx playwright show-trace test-results/trace.zip
```

### Screenshot on Failure

Screenshots are automatically captured. Check:
```
test-results/
```

### Use Page Screenshots in Tests

```typescript
test('example', async ({ page }) => {
  await page.screenshot({ path: 'my-screenshot.png' });
});
```

### Print Debug Information

```typescript
test('example', async ({ page }) => {
  console.log('Current URL:', page.url());
  console.log('Page title:', await page.title());
});
```

### Use Test.step for Better Reports

```typescript
test('complex flow', async ({ page }) => {
  await test.step('Login', async () => {
    await page.goto('/login');
    // login code
  });

  await test.step('Verify profile', async () => {
    await page.goto('/profile');
    // assertions
  });
});
```

## Best Practices

### 1. Use Data-TestID Attributes

Add `data-testid` to critical UI elements for stable selectors:

```html
<button data-testid="delete-account">Delete Account</button>
```

```typescript
await page.getByTestId('delete-account').click();
```

### 2. Wait for Network Activity

```typescript
// Wait for specific network request
await page.waitForLoadState('networkidle');

// Wait for specific response
await page.waitForResponse(response => 
  response.url().includes('/movies') && response.status() === 200
);
```

### 3. Use Appropriate Waits

```typescript
// Wait for element to be visible with timeout
await expect(page.locator('.modal')).toBeVisible({ timeout: 5000 });

// Wait for navigation
await page.waitForURL('**/movies', { timeout: 10000 });
```

### 4. Test User-Visible Behavior

Prefer locators that match user interactions:

```typescript
// Good: Match what user sees
await page.getByRole('button', { name: /login/i }).click();
await page.getByLabel('Username').fill('testuser');

// Avoid: Brittle selectors
await page.locator('button.btn-login-123').click();
```

### 5. Handle Dialogs Properly

```typescript
// Wait for dialog and check content
await expect(page.locator('mat-dialog-container')).toBeVisible();
await expect(page.locator('text=Confirm')).toBeVisible();

// Close dialog
await page.keyboard.press('Escape');
// or
await page.locator('button:has-text("Cancel")').click();
```

### 6. API-Based Setup for Speed

Use the API to set up test data instead of UI:

```typescript
// Instead of logging in via UI, use API fixture
test('test with auth', async ({ authenticatedPage: page }) => {
  // User is already logged in via API
  await page.goto('/profile');
});
```

### 7. Clean State Between Tests

The authentication fixture clears localStorage after each test:

```typescript
// Cleanup is automatic
await page.evaluate(() => {
  localStorage.clear();
});
```

### 8. Group Related Tests

```typescript
test.describe('Authentication', () => {
  test('should login', async ({ page }) => {
    // ...
  });

  test('should register', async ({ page }) => {
    // ...
  });
});
```

### 9. Use beforeEach for Common Setup

```typescript
test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
});
```

### 10. Add Datatest IDs to Components

In your Angular components, add `data-testid` to important elements:

```html
<!-- user-profile.component.html -->
<button data-testid="delete-account">Delete Account</button>
<input data-testid="username-input" [(ngModel)]="user.username">
```

## Maintenance

### Regular Updates

Keep Playwright updated:
```bash
npm update @playwright/test playwright
```

### Review Test Failures

1. Check GitHub Actions logs
2. Download failed test artifacts
3. View HTML report and video recordings
4. Update tests if UI has changed

### Add New Tests

Follow the structure in existing test files:
1. Create new `.spec.ts` file in `tests/specs/`
2. Import fixtures and expect
3. Use `test.describe()` for grouping
4. Write assertions with clear expectations

### Refactor Tests

Extract common patterns into fixtures:
```typescript
// In fixtures/custom.fixture.ts
export const test = base.extend({
  myCustomFixture: async ({ page }, use) => {
    // Setup
    await use(page);
    // Cleanup
  },
});
```

## Troubleshooting

### Issue: Tests timeout locally but pass in CI

**Solution**: Your local environment may be slower. Increase timeouts:
```typescript
test('slow test', async ({ page }) => {
  await expect(page.locator('.element')).toBeVisible({ timeout: 10000 });
}, { timeout: 60000 }); // 60 second test timeout
```

### Issue: "Browser is not installed"

**Solution**: Install Playwright browsers:
```bash
npx playwright install --with-deps
```

### Issue: Tests fail with "Connection refused"

**Solution**: Make sure the Angular dev server is running:
```bash
npm start
```

### Issue: Tests fail in CI but pass locally

**Solution**: CI runs in headless mode. Try locally:
```bash
npx playwright test --headed=false
```

Also check environment variables are set correctly in GitHub Secrets.

### Issue: Flaky tests (sometimes pass, sometimes fail)

**Solution**:
- Use proper waits instead of fixed timeouts
- Avoid race conditions with `waitForLoadState('networkidle')`
- Increase retries on CI
- Check selectors are stable

## Additional Resources

- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [MyFlix API Documentation](https://movie-api-eqfh.vercel.app/)

## Contact & Support

For issues or questions about the E2E test setup, please create an issue in the repository with:
- Description of the problem
- Steps to reproduce
- Logs or screenshots from test runs
- Environment details (Node version, OS, browser)
