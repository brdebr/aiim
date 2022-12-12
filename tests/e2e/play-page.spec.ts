import { ConsoleMessage, expect, test } from "@playwright/test";
import { basePage } from "../constants";
import { expectCleanConsole, getConsoleMessages, getProjectNameForFile, goWait, logApiCalls, savePageScreenshot } from "../utils";

// Load browser state from previous test.
test.use({ storageState: `./e2e/loggedState.json` });

test.describe("Play", () => {

  test('should load page without errors', async ({ page }, info) => {

    const consoleMessages = getConsoleMessages(page);
    logApiCalls(page, info);

    await goWait(page, `${basePage}/play`);

    expectCleanConsole(consoleMessages, info);

    await savePageScreenshot(page, 'play', info);
  });

});