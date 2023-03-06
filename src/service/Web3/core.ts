import { createClient } from '@wagmi/core';

import { web3Config } from './config';

export const web3Client = createClient(web3Config);
