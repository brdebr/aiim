import { ConsoleMessage, expect, test, TestInfo } from "@playwright/test";
import { basePage } from "../constants";
import { expectCleanConsole, getConsoleMessages, getProjectNameForFile, goWait, logApiCalls, savePageScreenshot } from "../utils";


// Load browser state from previous test.
test.use({ storageState: `./e2e/loggedState.json` });

test.describe("Gallery", () => {

  test('should load page without errors', async ({ page }, info) => {

    const consoleMessages = getConsoleMessages(page);
    logApiCalls(page, info);

    await goWait(page, `${basePage}/gallery`);

    expectCleanConsole(consoleMessages, info);

    await page.waitForTimeout(10 * 850);
    await savePageScreenshot(page, 'gallery', info);
  });

});
