import { logApiCalls, savePageScreenshot } from './../utils';
import { ConsoleMessage, expect, test } from "@playwright/test";
import { basePage } from "../constants";
import { expectCleanConsole, getConsoleMessages, getProjectNameForFile, goWait } from "../utils";

// Load browser state from previous test.
test.use({ storageState: `./e2e/loggedState.json` });

test.describe("Votes", () => {

  test('should load page without errors', async ({ page }, info) => {

    const consoleMessages = getConsoleMessages(page);
    logApiCalls(page, info);

    await goWait(page, `${basePage}/votes`);

    expectCleanConsole(consoleMessages, info);

    await savePageScreenshot(page, 'votes', info);
  });

});