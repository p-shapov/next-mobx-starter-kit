import { computed, makeObservable, observable } from 'mobx';

import type { FormField } from './FormField';

abstract class Form {
  fields: Array<FormField> = [];

  get record() {
    return this.fields.reduce(
      (acc, { name, value }) => ({ ...acc, [name]: value }),
      {} as Record<string, string | number | boolean>,
    );
  }

  get json() {
    return JSON.stringify(this.record);
  }

  get isValid() {
    return this.fields.every(({ isValid }) => isValid);
  }

  get isInvalid() {
    return this.fields.every(({ isInvalid }) => isInvalid);
  }

  constructor() {
    makeObservable(this, {
      fields: observable,
      record: computed,
      json: computed,
      isValid: computed,
      isInvalid: computed,
    });
  }
}

export { Form };
