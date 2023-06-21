import fs from 'fs/promises';
import path from 'path';

import { SELECTOR, crawl as crawlPage } from './process.js';
import { JOB_GUIDE_PAGES } from './pages.js';

const OUTPUT_PATH = 'db/actions/jobs';

export async function crawl(browser) {
  const page = await browser.newPage();

  for (let job of JOB_GUIDE_PAGES) {
    console.info(`Crawling Job Guide: ${job.url}`);

    await page.goto(job.url);
    const data = await page.$$eval(SELECTOR, crawlPage);

    const filename = path.resolve(OUTPUT_PATH, `${job.outputFilename}.json`);
    await fs.writeFile(filename, JSON.stringify(data, null, 2));
  }
}
