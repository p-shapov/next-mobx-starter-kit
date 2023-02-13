import { action, computed, makeObservable, observable } from 'mobx';

import {
  type GetDataPoint,
  type PostDataPoint,
  FormFieldVM,
  FormVM,
  registerField,
  registerValidator,
} from 'lib/mobx';
import { type SalePhase } from 'lib/types/common';

import { type ISaleVM } from './Interface';

const MIN_COUNT = 1;

export abstract class SaleVM extends FormVM implements ISaleVM {
  @observable
  amount = new FormFieldVM('count', MIN_COUNT);

  abstract price: GetDataPoint<number, []>;
  abstract phase: GetDataPoint<SalePhase, [unknown]>;
  abstract supply: GetDataPoint<number, []>;
  abstract mint: PostDataPoint<void, [number]>;

  @computed
  get totalPrice() {
    if (this.price.data.value) {
      return {
        ...this.price,
        data: {
          ...this.price.data,
          value: this.price.data.value * this.amount.value,
        },
      };
    }

    return this.price;
  }

  @action.bound
  increase(): void {
    this.amount.setValue((prev) => prev + 1);
  }

  @action.bound
  decrease(): void {
    this.amount.setValue((prev) => prev - 1);
  }

  constructor() {
    super();
    makeObservable(this);
    registerField(this, this.amount);
    registerValidator(this.amount, () => {
      if (this.supply.data.value) {
        if (this.amount.value < MIN_COUNT || this.amount.value > this.supply.data.value)
          return `An amount of tokens must be in range from ${MIN_COUNT} to ${this.supply.data.value}`;
      }
    });
  }
}
