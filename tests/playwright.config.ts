import type { PlaywrightTestConfig } from '@playwright/test';
import { devices } from '@playwright/test';

const SamsungNoteLite10Device = {
  name: 'Samsung Galaxy Note Lite 10',
  use: {
    ...devices['Pixel 5'],
    ...{
      "screen": {
        "width": 412,
        "height": 915
      },
      "viewport": {
        "width": 412,
        "height": 778
      },
      "deviceScaleFactor": 2.63,
    }
  }
};

const GoogleChromeDevice = {
  name: 'Google Chrome',
  use: {
    channel: 'chrome',
    ...{
      "screen": {
        "width": 1920,
        "height": 1080
      },
      "viewport": {
        "width": 1920,
        "height": 898
      },
      "deviceScaleFactor": 1.00,
    }
  },
};

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
const config: PlaywrightTestConfig = {
  testDir: './.',
  /* Maximum time one test can run for. */
  timeout: 30 * 1000,
  expect: {
    /**
     * Maximum time expect() should wait for the condition to be met.
     * For example in `await expect(locator).toHaveText();`
     */
    timeout: 5000
  },
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 1,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Maximum time each action such as `click()` can take. Defaults to 0 (no limit). */
    actionTimeout: 0,
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://localhost:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: process.env.CI ? 'on-first-retry' : 'on',
  },

  /* Configure projects for major browsers */
  projects: [
    // {
    //   name: 'Chromium',
    //   use: {
    //     ...devices['Desktop Chrome'],
    //   },
    // },

    {
      name: 'Firefox',
      use: {
        ...devices['Desktop Firefox'],
      },
    },

    {
      name: 'Safari',
      use: {
        ...devices['Desktop Safari'],
      },
    },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: {
    //     ...devices['Pixel 5'],
    //   },
    // },
    SamsungNoteLite10Device,
    GoogleChromeDevice,
    // {
    //   name: 'Mobile Safari',
    //   use: {
    //     ...devices['iPhone 12'],
    //   },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: {
    //     channel: 'msedge',
    //   },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: {
    //     channel: 'chrome',
    //   },
    // },
  ],

  /* Folder for test artifacts such as screenshots, videos, traces, etc. */
  outputDir: 'test-results/',

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   port: 3000,
  // },
};

export default config;
