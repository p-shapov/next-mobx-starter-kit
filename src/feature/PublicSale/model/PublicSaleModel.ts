import { action, computed, flow, makeObservable } from 'mobx';

import { api } from 'service/API/core';

import { autoFetchable } from 'shared/mobx/AutoFetchable';

import { IPublicSaleModel } from './Interface';

const fetchPrice = flow(function* () {
  const result: number = yield api.get('/api/price/').then((res) => res.data);

  return result;
});

const fetchPhase = flow(function* () {
  const result: 'Soon' | 'Started' | 'Finished' = yield api.get('/api/phase/').then((res) => res.data);

  return result;
});

const fetchSupply = flow(function* (phase: 'Soon' | 'Started' | 'Finished') {
  const result: number = yield api.get(`/api/supply/${phase}/`).then((res) => res.data);

  return result;
});

export class PublicSaleModel implements IPublicSaleModel {
  get price() {
    return this.priceAutoFetchable.data;
  }
  get supply() {
    return this.supplyAutoFetchable.data;
  }
  get phase() {
    return this.phaseAutoFetchable.data;
  }

  hydrate(data: { price: number; supply: number; phase: 'Soon' | 'Started' | 'Finished' }) {
    this.priceAutoFetchable.hydrate(data.price);
    this.phaseAutoFetchable.hydrate(data.phase);
    this.supplyAutoFetchable.hydrate(data.supply);
  }

  async mint(count: number) {
    // eslint-disable-next-line no-console
    console.log(count);
  }

  constructor(private readonly isSsr?: boolean) {
    makeObservable(this, {
      price: computed,
      supply: computed,
      phase: computed,
      mint: action.bound,
    });

    // makeObservable(this, {
    //   price: computed,
    //   supply: computed,
    //   phase: computed,
    //   mint: action.bound,
    //   fetchPrice: computed,
    //   fetchPhase: computed,
    //   fetchSupply: computed,
    // });
  }

  private readonly priceAutoFetchable = autoFetchable({
    getFetch: () => fetchPrice,
    getDeps: () => [] as const,
    isSsr: this.isSsr,
  });

  private readonly phaseAutoFetchable = autoFetchable({
    getFetch: () => fetchPhase,
    getDeps: () => [] as const,
    isSsr: this.isSsr,
  });

  private readonly supplyAutoFetchable = autoFetchable({
    getFetch: () => fetchSupply,
    getDeps: () => this.phase.value && ([this.phase.value] as const),
    isSsr: this.isSsr,
  });

  // private readonly priceAutoFetchable = autoFetchable({
  //   getFetch: () => this.fetchPrice,
  //   getDeps: () => [] as const,
  //   isSsr: this.isSsr,
  // });

  // private readonly phaseAutoFetchable = autoFetchable({
  //   getFetch: () => this.fetchPhase,
  //   getDeps: () => [] as const,
  //   isSsr: this.isSsr,
  // });

  // private readonly supplyAutoFetchable = autoFetchable({
  //   getFetch: () => this.fetchSupply,
  //   getDeps: () => [] as const,
  //   isSsr: this.isSsr,
  // });

  // private get fetchPrice() {
  //   return fetchPrice;
  // }

  // private get fetchPhase() {
  //   return fetchPhase;
  // }

  // private get fetchSupply() {
  //   return this.phase.value && fetchSupply.bind(null, this.phase.value);
  // }
}
