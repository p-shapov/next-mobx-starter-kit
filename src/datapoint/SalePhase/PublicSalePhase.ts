import { flow } from 'mobx';

import { DataPoint } from 'lib/mobx';
import { sleep } from 'lib/utils';
import { type SalePhase } from 'lib/types/common';

import { api } from 'service/API/core';

import { type ISalePhase } from './Interface';

const fetchPhase = flow(function* (signal: AbortSignal) {
  const result: SalePhase = yield api.get('/phase', { signal }).then((res) => res.data);

  yield sleep(2000);

  return result;
});

export class PublicSalePhase extends DataPoint<SalePhase, []> implements ISalePhase {
  constructor() {
    super({ getFetch: () => fetchPhase, getDeps: () => [] });
  }
}
