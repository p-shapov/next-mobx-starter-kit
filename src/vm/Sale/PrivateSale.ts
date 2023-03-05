import { Service } from 'typedi';
import { flow } from 'mobx';

import { AbstractFactory } from 'lib/types/AbstractFactory';
import { sleep } from 'lib/utils';
import type { SalePhase } from 'lib/types/common';

import { type Action, InjectActionFactory } from 'service/Action';
import { type Datapoint, InjectDatapoint, map } from 'service/Datapoint';
import { api } from 'service/API/core';

import { AbstractSale } from './AbstractSale';
import { tokens } from './tokens';

const fetchPhase = flow(function* (signal: AbortSignal) {
  const result: SalePhase = yield api.get('/phase', { signal }).then((res) => res.data);

  return result;
});

const fetchPrice = flow(function* (signal: AbortSignal) {
  const result: number = yield api.get('/price', { signal }).then((res) => res.data);

  return result;
});

const fetchSupply = flow(function* (signal: AbortSignal) {
  const result: number = yield api.get('/supply', { signal }).then((res) => res.data);

  return result;
});

const fetchMint = flow(function* (count: number) {
  yield sleep(2000);

  // eslint-disable-next-line no-console
  console.log(count);
});

@Service({ global: true })
export class PrivateSale extends AbstractSale {
  mint = this.mintFactory.create(() => [this.amount.value]);
  totalPrice = map(this.price, (x) => x * this.amount.value);

  constructor(
    @InjectDatapoint({ fetch: fetchPhase, token: tokens.phase })
    public phase: Datapoint<SalePhase>,
    @InjectDatapoint({ fetch: fetchPrice, token: tokens.price }) public price: Datapoint<number>,
    @InjectDatapoint({ fetch: fetchSupply, token: tokens.supply })
    public supply: Datapoint<number>,
    @InjectActionFactory({ fetch: fetchMint, token: tokens.mint })
    private mintFactory: AbstractFactory<[() => [number]], Action<void, [number]>>,
  ) {
    super();
  }
}
