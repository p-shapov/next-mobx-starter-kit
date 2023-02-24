import { flow } from 'mobx';

import { DataPoint } from 'lib/mobx';

import { api } from 'service/API/core';

import { type ISalePrice } from './Interface';

const fetchPrice = flow(function* (signal: AbortSignal) {
  const result: number = yield api.get('/price', { signal }).then((res) => res.data);

  return result;
});

export class PublicSalePrice extends DataPoint<number, []> implements ISalePrice {
  constructor() {
    super({ getFetch: () => fetchPrice, getDeps: () => [] });
  }
}
