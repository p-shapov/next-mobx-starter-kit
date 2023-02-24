import {
  action,
  computed,
  makeObservable,
  observable,
  onBecomeObserved,
  onBecomeUnobserved,
  reaction,
} from 'mobx';

export abstract class Form {
  readonly fields: Array<FormField> = [];

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

export class FormField<T = string | number | boolean> {
  name: string;
  value: T;
  error: string | null;

  get isValid() {
    return !!this.error;
  }

  get isInvalid() {
    return !this.error;
  }

  readonly setValue = <D extends T>(valueOrSetter: D | ((prev: D) => D)) => {
    if (typeof valueOrSetter !== 'function') {
      this.value = valueOrSetter;
    } else {
      this.value = (valueOrSetter as (prev: T) => T)(this.value);
    }
  };

  constructor(name: string, initial: T) {
    this.name = name;
    this.value = initial;
    this.error = null;

    makeObservable(this, {
      name: observable,
      error: observable,
      value: observable,
      isValid: computed,
      isInvalid: computed,
      setValue: action,
    });
  }
}

type ValidatorCallback<T> = (field: T) => string | undefined;

export const registerField = (form: Form, field: FormField) => {
  form.fields.push(field);
};

export const registerValidator = <T>(field: FormField<T>, callback: ValidatorCallback<T>) => {
  let disposeListener: () => void = () => void 0;

  onBecomeObserved(field, 'value', () => {
    disposeListener = reaction(
      () => field.value,
      (value) => {
        field.error = callback(value) || null;
      },
      { fireImmediately: true },
    );
  });
  onBecomeUnobserved(field, 'value', disposeListener);
};
