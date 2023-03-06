import { readContract } from '@wagmi/core';
import { flow } from 'mobx';
import { Token } from 'typedi';

import { BimkonEyes } from 'assets/contracts';

import { formatBigint } from 'service/API/formatters';
import { type DatapointController } from 'service/Datapoint';

export const getPrice: DatapointController<number> = flow(function* () {
  const raw: bigint = yield readContract({
    ...BimkonEyes,
    functionName: 'whiteListSalePrice',
  });

  return formatBigint(raw);
});

getPrice.token = new Token();
