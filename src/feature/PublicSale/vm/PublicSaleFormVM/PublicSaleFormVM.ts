import { action, computed, makeObservable, observable, override } from 'mobx';

import { FormFieldVM, FormVM, registerField, registerValidator } from 'shared/mobx/FormVM';
import { FetchData } from 'shared/types/common';

import { IPublicSaleModel } from '../../model';
import { IPublicSaleFormVM } from './Interface';

const MIN_COUNT = 1;

export class PublicSaleFormVM extends FormVM implements IPublicSaleFormVM {
  count = new FormFieldVM('count', MIN_COUNT);

  get price() {
    return this.model.price;
  }

  get supply() {
    return this.model.supply;
  }

  get phase() {
    return this.model.phase;
  }

  get isLoaded(): boolean {
    return [this.price, this.supply, this.phase].every(({ status }) => status === 'Succeed');
  }

  get totalPrice(): FetchData<number, null> {
    if (this.price.status === 'Succeed' && this.price.value) {
      return {
        ...this.price,
        value: this.price.value * this.count.value,
      };
    }

    return this.price;
  }

  async submit() {
    this.status = 'loading';
    this.error = undefined;

    if (this.isValid) {
      try {
        await this.model.mint(this.count.value);
        this.status = 'succeed';
      } catch (error) {
        if (typeof error === 'string') this.error = error;
        this.status = 'error';
      }
    }
  }

  increase() {
    if (this.supply.status === 'Succeed' && this.supply.value) {
      if (this.count.value < this.supply.value) this.count.setValue(this.count.value + 1);
    }
  }

  decrease() {
    if (this.count.value > MIN_COUNT) this.count.setValue(this.count.value - 1);
  }

  constructor(private model: IPublicSaleModel) {
    super();

    makeObservable(this, {
      count: observable,
      price: computed,
      supply: computed,
      phase: computed,
      isLoaded: computed,
      totalPrice: computed,
      submit: override,
      increase: action.bound,
      decrease: action.bound,
    });

    registerField(this, this.count);
    registerValidator(this.count, () => void 0);
  }
}
