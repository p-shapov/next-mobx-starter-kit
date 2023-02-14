import { flow } from 'mobx';
import { Service } from 'typedi';

import { GetDataPoint } from 'lib/mobx';
import { sleep } from 'lib/utils';
import { type SalePhase } from 'lib/types/common';

import { api } from 'service/API/core';

import { type ISalePhaseDP } from './Interface';
import { IoCTypes } from './IoCTypes';

const fetchPhase = flow(function* (echo: unknown, signal: AbortSignal) {
  const result: SalePhase = yield api.get('/phase', { signal }).then((res) => res.data);

  yield sleep(2000);

  // eslint-disable-next-line no-console
  console.log(echo);

  return result;
});

@Service(IoCTypes.IPublicSalePhaseDP)
export class PublicSalePhaseDP extends GetDataPoint<SalePhase, [unknown]> implements ISalePhaseDP {
  constructor() {
    super({ getFetch: () => fetchPhase, getDeps: () => null });
  }
}
