import { test, expect, type Page, ConsoleMessage } from '@playwright/test';
import { basePage } from '../constants';
import { goWait, waitForResponseAndLog } from '../utils';

const validEmail = 'brdebr.93@gmail.com';
const validPassword = 'mypassucu';

test.describe('Auth', () => {

  test('should login with valid credentials', async ({ page }, info) => {

    await goWait(page, `${basePage}/`);

    // Fill in the login form and submit.
    await page.fill('input[name="email"]', validEmail);
    await page.waitForTimeout(100);
    await page.fill('input[name="password"]', validPassword);

    await page.click('button[type="submit"]');

    await Promise.all([
      page.waitForURL('**\/play'),
      waitForResponseAndLog('**/api/auth/login', page, info),
    ]);
    await expect(page.url(), 'Navigated to Play page').toBe(`${basePage}/play`);

    // Save browser state to use later
    await page.context().storageState({ path: `./e2e/loggedState.json`});
  });

});
