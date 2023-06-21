import puppeteer from 'puppeteer';

import { crawl } from './job-guide/index.js';

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });

  await crawl(browser);

  await browser.close();
})();
