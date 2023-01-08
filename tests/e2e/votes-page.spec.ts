import { logApiCalls, savePageScreenshot } from './../utils';
import { ConsoleMessage, expect, test } from "@playwright/test";
import { basePage } from "../constants";
import { expectCleanConsole, getConsoleMessages, getProjectNameForFile, goWait } from "../utils";
import { voteMockRespose } from './mocks';

// Load browser state from previous test.
test.use({ storageState: `./e2e/loggedState.json` });

test.describe("Votes", () => {

  test('should load page without errors', async ({ page }, info) => {

    const consoleMessages = getConsoleMessages(page);
    logApiCalls(page, info);

    // mock the api call to force specific votes
    page.route('**/api/vote/my-votes?type=FAVORITE', route => route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(voteMockRespose)
    }));

    await goWait(page, `${basePage}/votes`);

    expectCleanConsole(consoleMessages, info);

    await savePageScreenshot(page, 'votes', info);
  });

});