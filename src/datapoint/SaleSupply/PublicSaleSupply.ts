import { flow } from 'mobx';

import { DataPoint } from 'lib/mobx';

import { api } from 'service/API/core';

import { type ISaleSupply } from './Interface';

const fetchSupply = flow(function* (signal: AbortSignal) {
  const result: number = yield api.get('/supply', { signal }).then((res) => res.data);

  return result;
});

export class PublicSaleSupply extends DataPoint<number, []> implements ISaleSupply {
  constructor() {
    super({ getFetch: () => fetchSupply, getDeps: () => [] });
  }
}
