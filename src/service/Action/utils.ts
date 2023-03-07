import { makeAutoObservable } from 'mobx';

import type { MappedAction } from './types';

export const map = <T, K, D extends Array<unknown> = []>(
  a: MappedAction<T, D>,
  f: (x: T) => K,
): MappedAction<K, D> => {
  return makeAutoObservable({
    data: {
      get value() {
        return a.data.value && f(a.data.value);
      },
      get status() {
        return a.data.status;
      },
      get error() {
        return a.data.error;
      },
    },
    send: a.send,
    cancel: a.cancel,
  });
};
