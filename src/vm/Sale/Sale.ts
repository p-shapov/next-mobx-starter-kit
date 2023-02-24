import { type DataPoint, type Action, FormField, Form, registerField, registerValidator } from 'lib/mobx';
import { type SalePhase } from 'lib/types/common';

import { type ISale } from './Interface';

const MIN_COUNT = 1;

export abstract class Sale extends Form implements ISale {
  abstract readonly mint: Action<void, [number]>;

  abstract readonly price: DataPoint<number, []>;
  abstract readonly phase: DataPoint<SalePhase, []>;
  abstract readonly supply: DataPoint<number, []>;
  abstract readonly totalPrice: DataPoint<number, []>;

  amount = new FormField('count', MIN_COUNT);

  readonly increase = () => {
    const supply = this.supply.data.value;

    if (typeof supply !== 'undefined') this.amount.setValue((prev) => Math.min(supply, prev + 1));
  };

  readonly decrease = this.amount.setValue.bind(this.amount, (prev) => Math.max(MIN_COUNT, prev - 1));

  constructor() {
    super();
    registerField(this, this.amount);
    registerValidator(this.amount, () => {
      if (this.supply.data.value) {
        if (this.amount.value < MIN_COUNT || this.amount.value > this.supply.data.value)
          return `An amount of tokens must be in range from ${MIN_COUNT} to ${this.supply.data.value}`;
      }
    });
  }
}
