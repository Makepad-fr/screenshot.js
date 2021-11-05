import {
  Browser, BrowserContext, BrowserContextOptions,
  BrowserType, chromium, ElementHandle, firefox, LaunchOptions, PageScreenshotOptions,
  webkit,
} from 'playwright-core';

/**
 * Takes a screenshot of whatever you want on a given web page.
 * @param url website url
 * @param options screenshot options
 * @param selector selector of the element
 * @param browser the type of the browser.Defaults firefox
 * @param launchOptions launch options used while launching browser
 * @param contextOptions context options used while creating new browser context
 */
export default async function screenshot(
  url:string,
  options?:PageScreenshotOptions,
  selector?:string,
  browser:'firefox' | 'chrome' | 'webkit' = 'firefox',
  launchOptions?:LaunchOptions,
  contextOptions?:BrowserContextOptions,
)
  :Promise<Buffer> {
  let browserType:BrowserType;
  switch (browser) {
    case 'firefox':
      browserType = firefox;
      break;
    case 'chrome':
      browserType = chromium;
      break;
    default:
      browserType = webkit;
  }
  const b:Browser = await browserType.launch(launchOptions);
  const context:BrowserContext = await b.newContext(contextOptions);
  const page = await context.newPage();
  await page.goto(url);
  let element:ElementHandle | undefined;
  if (selector !== undefined) {
    await page.waitForSelector(selector);
    element = await page.$(selector) ?? undefined;
  }
  const res:Buffer = await (element ?? page).screenshot(options);
  await b.close();
  return res;
}
