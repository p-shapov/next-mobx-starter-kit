import { readContract } from '@wagmi/core';
import { flow } from 'mobx';
import { Token } from 'typedi';

import { BimkonEyes } from 'assets/contracts';

import { formatBigint } from 'lib/utils/converters';

import type { DatapointController } from 'service/Datapoint/types';

const getPrice: DatapointController<number> = flow(function* () {
  const raw: bigint = yield readContract({
    ...BimkonEyes,
    functionName: 'publicSalePrice',
  });

  return formatBigint(raw);
});

getPrice.token = new Token();

export { getPrice };
