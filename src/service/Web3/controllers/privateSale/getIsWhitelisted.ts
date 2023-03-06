import { type Address, readContract } from '@wagmi/core';
import { Token } from 'typedi';
import { flow } from 'mobx';

import { BimkonEyes } from 'assets/contracts';

import { type DatapointController } from 'service/Datapoint';

export const getIsWhitelisted: DatapointController<boolean, [merkleRoot: Array<Address>, address: Address]> =
  flow(function* (merkleRoot, address) {
    return yield readContract({
      ...BimkonEyes,
      functionName: 'isWhiteListed',
      args: [merkleRoot, address],
    });
  });

getIsWhitelisted.token = new Token();
