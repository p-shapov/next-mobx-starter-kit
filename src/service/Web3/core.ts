import { createClient } from '@wagmi/core';

import { web3Config } from './config';

const web3Client = createClient(web3Config);

export { web3Client };
