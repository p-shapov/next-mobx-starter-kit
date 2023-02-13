import { flow, makeObservable } from 'mobx';
import { Service } from 'typedi';

import { GetDataPoint } from 'lib/mobx';

import { api } from 'service/API/core';

import { type ISaleSupplyDP } from './Interface';
import { IoCTypes } from './IoCTypes';

const fetchSupply = flow(function* () {
  const result: number = yield api.get('/supply/').then((res) => res.data);

  return result;
});

@Service(IoCTypes.IPrivateSaleSupplyDP)
export class PrivateSaleSupplyDP extends GetDataPoint<number, []> implements ISaleSupplyDP {
  constructor() {
    super({ getFetch: () => fetchSupply, getDeps: () => [] });
    makeObservable(this);
  }
}
