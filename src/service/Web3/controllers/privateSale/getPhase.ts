import { readContract } from '@wagmi/core';
import { flow } from 'mobx';
import { Token } from 'typedi';

import { BimkonEyes } from 'assets/contracts';

import { SalePhase } from 'lib/types/common';

import { formatSalePhase } from 'service/API/formatters';
import { type DatapointController } from 'service/Datapoint';

export const getPhase: DatapointController<SalePhase> = flow(function* () {
  const raw: number = yield readContract({
    ...BimkonEyes,
    functionName: 'whiteListSale',
  });

  return formatSalePhase(raw);
});

getPhase.token = new Token();
