import { defineConfig, devices } from '@playwright/test';
import * as path from 'path';
import { config as loadEnv } from 'dotenv';

// Load environment variables from .env file
loadEnv({ path: path.resolve(__dirname, '.env'), quiet: !!process.env['CI'] });
loadEnv({ path: path.resolve(__dirname, '.env.local'), quiet: !!process.env['CI'] });

/**
 * Determine environment
 */
const isCI = !!process.env['CI'];

/**
 * Base URL logic:
 * 1. Use BASE_URL if explicitly provided
 * 2. If running in CI, default to production
 * 3. Otherwise use local Angular dev server
 */
const baseURL =
  process.env['BASE_URL'] ||
  'http://127.0.0.1:4200';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests/specs',

  /* Disable full parallel in CI for stability */
  fullyParallel: !isCI,

  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: isCI,

  /* Retry on CI only */
  retries: isCI ? 2 : 0,

  /* Force single worker in CI */
  workers: isCI ? 1 : undefined,

  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html'],
    ['list'],
    ['github'],
    ['junit', { outputFile: 'test-results/junit.xml' }],
  ],

  /* Shared settings for all the projects below. */
  use: {
    baseURL,

    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',

    actionTimeout: 15000,
    navigationTimeout: 25000,
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],

  webServer: isCI
    ? undefined
    : {
        command: 'npx ng serve --host 127.0.0.1 --port 4200',
        url: 'http://127.0.0.1:4200',
        reuseExistingServer: false,
        timeout: 180 * 1000,
      },
});