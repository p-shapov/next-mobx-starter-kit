import { type Address, readContract } from '@wagmi/core';
import { flow } from 'mobx';
import { Token } from 'typedi';

import { BimkonEyes } from 'assets/contracts';

import { formatBigint } from 'lib/utils/converters';

import type { DatapointController } from 'service/Datapoint/types';

const getAllowedToMint: DatapointController<number, [address: Address]> = flow(function* (address: Address) {
  const raw: bigint = yield readContract({
    ...BimkonEyes,
    functionName: 'allowedToPublicMintAmount',
    args: [address],
  });

  return formatBigint(raw);
});

getAllowedToMint.token = new Token();

export { getAllowedToMint };
