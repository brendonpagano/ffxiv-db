import fs from 'fs/promises';
import path from 'path';

import { processJobAction } from './processor/index.js';

(async () => {
  let fHandle;
  try {
    fHandle = await fs.open(path.resolve('db/actions/jobs/sam.json'), 'r+');
    const pldData = JSON.parse(await fHandle.readFile('utf-8'));

    pldData.jobActions = pldData.jobActions.map((ja) => processJobAction(ja));

    await fHandle.write(JSON.stringify(pldData, null, 2), 0);
  } finally {
    await fHandle.close();
  }

  //
})();
