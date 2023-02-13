import {
  action,
  computed,
  makeObservable,
  observable,
  onBecomeObserved,
  onBecomeUnobserved,
  reaction,
} from 'mobx';

export abstract class FormVM {
  @observable
  readonly fields: Array<FormFieldVM> = [];

  @computed
  get record() {
    return this.fields.reduce(
      (acc, { name, value }) => ({ ...acc, [name]: value }),
      {} as Record<string, string | number | boolean>,
    );
  }

  @computed
  get json() {
    return JSON.stringify(this.record);
  }

  @computed
  get isValid() {
    return this.fields.every(({ isValid }) => isValid);
  }

  @computed
  get isInvalid() {
    return this.fields.every(({ isInvalid }) => isInvalid);
  }

  constructor() {
    makeObservable(this);
  }
}

export class FormFieldVM<T = string | number | boolean> {
  @observable
  name: string;

  @observable
  error?: string;

  @observable
  value: T;

  @computed
  get isValid() {
    return typeof this.error === 'undefined';
  }

  @computed
  get isInvalid() {
    return typeof this.error !== 'undefined';
  }

  @action.bound
  setValue<D extends T>(valueOrSetter: D | ((prev: D) => D)) {
    if (typeof valueOrSetter !== 'function') {
      this.value = valueOrSetter;
    } else {
      this.value = (valueOrSetter as (prev: T) => T)(this.value);
    }
  }

  constructor(name: string, initial: T) {
    this.name = name;
    this.value = initial;

    makeObservable(this);
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
