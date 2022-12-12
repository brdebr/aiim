import { test, expect, type Page, ConsoleMessage } from '@playwright/test';
import { basePage } from '../constants';
import { expectCleanConsole, getConsoleMessages, getProjectNameForFile, goWait, logApiCalls, waitForResponseAndLog } from '../utils';

const validEmail = 'brdebr.93@gmail.com';
const validPassword = 'mypassucu';

test.describe('Login', () => {

  test('should login with valid credentials', async ({ page }, info) => {
    const consoleMessages = getConsoleMessages(page);

    await goWait(page, `${basePage}/`);

    await page.screenshot({ path: `./e2e/screenshots/login/login-page-${getProjectNameForFile(info)}.png` });

    // Check for console errors and warnings.
    expectCleanConsole(consoleMessages, info);

    // Take a screenshot of the login page.
    await expect(page, 'Matches previous login page screenshot').toHaveScreenshot('login-page.png');

    // Fill in the login form and submit.
    await page.fill('input[name="email"]', validEmail);
    await page.waitForTimeout(100);
    await page.fill('input[name="password"]', validPassword);

    await Promise.all([
      page.click('button[type="submit"]'),
      page.waitForURL('**\/play'),
      waitForResponseAndLog('**/api/auth/login', page, info),
    ]);
    await expect(page, 'Navigated to Play page').toHaveURL(`${basePage}/play`);
    
    // Wait for play page to load.
    await Promise.all([
      waitForResponseAndLog('**/api/images/card-game', page, info),
      waitForResponseAndLog('**/api/images/view/*', page, info),
      page.waitForSelector('[data-image-id][data-image-loaded]')
    ]);
  });

  test('should not login with invalid credentials', async ({ page }, info) => {
    const consoleMessages = getConsoleMessages(page);
    logApiCalls(page, info);

    await goWait(page, `${basePage}/`);

    await page.screenshot({ path: `./e2e/screenshots/login/login-page-${getProjectNameForFile(info)}.png` });

    // Check for console errors and warnings.
    expectCleanConsole(consoleMessages, info);

    // Take a screenshot of the login page.
    await expect(page, 'Matches previous login page screenshot').toHaveScreenshot('login-page.png');

    // Fill in the login form and submit.
    await page.fill('input[name="email"]', 'mynotrealemai@gmail-fake.com');
    await page.waitForTimeout(100);
    await page.fill('input[name="password"]', 'fakepassword');

    const [loginResponse] = await Promise.all([
      waitForResponseAndLog('**/api/auth/login', page, info),
      page.click('button[type="submit"]'),
    ]);
    const loginResponseJson = await loginResponse.json();
    expect(loginResponseJson).toMatchObject({
      message: 'Invalid credentials',
    });
    expect(loginResponse.ok()).toBeFalsy();
    expect(page).toHaveURL(`${basePage}`);

  });

});
