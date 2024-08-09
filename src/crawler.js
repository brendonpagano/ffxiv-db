import puppeteer from 'puppeteer';

import { crawl } from './job-guide/index.js';

(async () => {
  const hrstart = process.hrtime();

  const browser = await puppeteer.launch({ headless: 'new' });

  await crawl(browser);

  await browser.close();

  const hrend = process.hrtime(hrstart);
  console.log('Execution time (hr): %ds %dms', hrend[0], hrend[1] / 1000000);
})();
