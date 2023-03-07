import { makeAutoObservable } from 'mobx';

import type { MappedDatapoint } from './types';

export const map = <T, K, D extends Array<unknown> = []>(
  a: MappedDatapoint<T, D>,
  f: (x: T) => K,
): MappedDatapoint<K, D> => {
  return makeAutoObservable({
    data: {
      get value() {
        return a.data.value !== undefined ? f(a.data.value) : undefined;
      },
      get status() {
        return a.data.status;
      },
      get error() {
        return a.data.error;
      },
    },
    refetch: a.refetch,
  });
};

export const chain = <T, K, D1 extends Array<unknown> = [], D2 extends Array<unknown> = []>(
  a: MappedDatapoint<T, D1>,
  f: (a: T) => MappedDatapoint<K, D2>,
): MappedDatapoint<K, D1> => {
  return map(map(a, f), (x) => x.data.value as K);
};
