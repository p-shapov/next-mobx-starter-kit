import { type SalePhase } from 'lib/types/common';

import { FormField, Form, registerField, registerValidator } from 'service/Form';
import type { Action } from 'service/Action';
import type { Datapoint, MappedDatapoint } from 'service/Datapoint';

import { type ISale } from './Interface';

const MIN_COUNT = 1;

export abstract class AbstractSale extends Form implements ISale {
  abstract mint: Action<void, [number]>;

  abstract price: Datapoint<number, []>;
  abstract phase: Datapoint<SalePhase, []>;
  abstract supply: Datapoint<number, []>;
  abstract totalPrice: MappedDatapoint<number, []>;

  amount = new FormField('count', MIN_COUNT);

  increase = () => {
    const supply = this.supply.data.value;

    if (typeof supply !== 'undefined') this.amount.setValue((prev) => Math.min(supply, prev + 1));
  };

  decrease = this.amount.setValue.bind(this.amount, (prev) => Math.max(MIN_COUNT, prev - 1));

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
