import {
  action,
  computed,
  makeAutoObservable,
  makeObservable,
  observable,
  onBecomeObserved,
  onBecomeUnobserved,
  reaction,
} from 'mobx';

export abstract class FormVM {
  fields: Array<FormFieldVM> = [];

  status: 'idle' | 'loading' | 'succeed' | 'error' = 'idle';
  error?: string = undefined;

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

  abstract submit(): Promise<void>;

  constructor() {
    makeObservable(this, {
      fields: observable,
      status: observable,
      error: observable,
      record: computed,
      json: computed,
      isValid: computed,
      isInvalid: computed,
      submit: action.bound,
    });
  }
}

export class FormFieldVM<T = string | number | boolean> {
  name: string;
  error?: string;
  value: T;

  get isValid() {
    return typeof this.error === 'undefined';
  }

  get isInvalid() {
    return typeof this.error !== 'undefined';
  }

  setValue(value: T) {
    this.value = value;
  }

  constructor(name: string, initial: T) {
    this.name = name;
    this.value = initial;

    makeAutoObservable(this);
  }
}

type ValidatorCallback<T> = (field: T) => string | undefined;

export const registerField = (form: FormVM, field: FormFieldVM) => {
  form.fields.push(field);
};

export const registerValidator = <T>(field: FormFieldVM<T>, callback: ValidatorCallback<T>) => {
  let disposeListener: () => void = () => void 0;

  onBecomeObserved(field, 'value', () => {
    disposeListener = reaction(
      () => field.value,
      (value) => {
        field.error = callback(value);
      },
      { fireImmediately: true },
    );
  });
  onBecomeUnobserved(field, 'value', disposeListener);
};
