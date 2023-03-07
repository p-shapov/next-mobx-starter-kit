import { type Address, readContract } from '@wagmi/core';
import { flow } from 'mobx';
import { Token } from 'typedi';

import { BimkonEyes } from 'assets/contracts';

import type { DatapointController } from 'service/Datapoint/types';

const getWhitelisted: DatapointController<boolean | undefined, [Array<Address>, Address | undefined]> = flow(
  function* (whitelist, address) {
    if (!address) return undefined;

    const raw: boolean = yield readContract({
      ...BimkonEyes,
      functionName: 'canClaimAirDrop',
      args: [whitelist, address],
    });

    return raw;
  },
);

getWhitelisted.token = new Token();

export { getWhitelisted };
