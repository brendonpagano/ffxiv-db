import fs from 'fs/promises';
import path from 'path';

import { SELECTOR, crawl as crawlPage } from './process.js';
import { JOB_GUIDE_PAGES } from './pages.js';

const OUTPUT_PATH = 'db/actions/jobs';
const MAX_CONCURRENCY = 10;

export async function crawl(browser) {
  const pagesProgress = JOB_GUIDE_PAGES.map((page) => ({
    inProgressOrDone: false,
    ...page,
  }));

  return Promise.all(
    Array.from(new Array(MAX_CONCURRENCY)).map(async () => {
      const page = await browser.newPage();

      while (true) {
        const jobPage = pagesProgress.find((_) => !_.inProgressOrDone);
        if (!jobPage) {
          break;
        }

        console.info(`Crawling Job Guide: ${url}`);
        jobPage.inProgressOrDone = true;
        const { url, outputFilename } = jobPage;

        await page.goto(url);
        const data = await page.$$eval(SELECTOR, crawlPage);

        const filename = path.resolve(OUTPUT_PATH, `${outputFilename}.json`);
        await fs.writeFile(filename, JSON.stringify(data, null, 2));
      }
    })
  );
}
