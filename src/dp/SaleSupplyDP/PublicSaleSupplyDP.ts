import { flow } from 'mobx';
import { Service } from 'typedi';

import { GetDataPoint } from 'lib/mobx';

import { api } from 'service/API/core';

import { type ISaleSupplyDP } from './Interface';
import { IoCTypes } from './IoCTypes';

const fetchSupply = flow(function* (signal: AbortSignal) {
  const result: number = yield api.get('/supply', { signal }).then((res) => res.data);

  return result;
});

@Service(IoCTypes.IPublicSaleSupplyDP)
export class PublicSaleSupplyDP extends GetDataPoint<number, []> implements ISaleSupplyDP {
  constructor() {
    super({ getFetch: () => fetchSupply, getDeps: () => [] });
  }
}
