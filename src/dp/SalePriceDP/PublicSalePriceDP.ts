import { flow } from 'mobx';
import { Service } from 'typedi';

import { GetDataPoint } from 'lib/mobx';

import { api } from 'service/API/core';

import { type ISalePriceDP } from './Interface';
import { IoCTypes } from './IoCTypes';

const fetchPrice = flow(function* (signal: AbortSignal) {
  const result: number = yield api.get('/price', { signal }).then((res) => res.data);

  return result;
});

@Service(IoCTypes.IPublicSalePriceDP)
export class PublicSalePriceDP extends GetDataPoint<number, []> implements ISalePriceDP {
  constructor() {
    super({ getFetch: () => fetchPrice, getDeps: () => [] });
  }
}
