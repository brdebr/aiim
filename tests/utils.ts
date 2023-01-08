import { ConsoleMessage, expect, Page, Request, TestInfo } from "@playwright/test";
import { basePage } from "./constants";

export const getProjectNameForFile = (info: TestInfo) => {
  const parsedProjectName = info.project.name.replace(/[^a-z0-9]/gi, '-');
  return parsedProjectName;
};

export const capitalize = (s: string) => {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export const goWait = async (page: Page, url: string) => {
  await Promise.all([
    page.goto(url, {
      waitUntil: 'domcontentloaded',
    }),
    page.waitForLoadState('networkidle'),
  ]);
  expect(page.url()).toBe(url);
}

export const getConsoleMessages = (page: Page) => {
  const consoleMessages: ConsoleMessage[] = [];
  page.on('console', (msg) => {
    consoleMessages.push(msg);
  });
  return consoleMessages;
}

export const expectCleanConsole = (consoleMessages: ConsoleMessage[], info: TestInfo) => {
  const badTypes = ['warning', 'error'];
  const logMessagesParsed = consoleMessages.map(el => {
    return {
      type: el.type(),
      text: el.text(),
    };
  });
  const warnings = logMessagesParsed.filter(el => el.type === 'warning');
  const errors = logMessagesParsed.filter(el => el.type === 'error');

  // expect(warnings, 'Console has no warnings').toEqual([]);
  expect(errors, 'Console has no errors').toEqual([]);
  info.annotations.push({ type: 'Console Messages', description: '' })
  logMessagesParsed.filter(el => !badTypes.includes(el.type)).forEach(el => {
    info.annotations.push({ type: 'Console.' + el.type, description: el.text })
  });
  info.annotations.push({ type: 'Error Messages', description: '' })
  logMessagesParsed.filter(el => badTypes.includes(el.type)).forEach(el => {
    info.annotations.push({ type: 'Console.' + el.type, description: el.text })
  });
}

export const savePageScreenshot = async (page: Page, pageName: string, info: TestInfo) => {
  await page.waitForTimeout(1000);
  await page.screenshot({ path: `./e2e/screenshots/${pageName}/${pageName}-page-${getProjectNameForFile(info)}.png` });
  const screenshot = await page.screenshot();
  await info.attach(`${capitalize(pageName)} - page`, { body: screenshot, contentType: 'image/png' });
}

export const logApiRequest = (request: Request, info: TestInfo) => {
  const date = new Date().toISOString();
  const method = request.method();
  const body = request.postDataJSON();
  const parsedUrl = request.url().replace(`${basePage}`, '');

  info.annotations.push({ type: 'API Request', description: `${date}: [${method}] ${parsedUrl} \n ${body ? JSON.stringify(body, null , 2): ''}` })
}

export const logApiCalls = (page: Page, info: TestInfo) => {
  page.on('request', (request) => {
    if (!request.url().includes('/api/')) return;
    logApiRequest(request, info);
  });
}

export const waitForResponseAndLog = async (url: string, page: Page, info: TestInfo) => {
  const response = await page.waitForResponse(url);

  try {
    logApiRequest(response.request(), info);
  } catch (error) {
    info.annotations.push({ type: 'Error parsing request body', description: `${url}` })
  }
  return response;
}
