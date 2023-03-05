import { makeAutoObservable } from 'mobx';

import { Status } from 'lib/types/common';

import type { Datapoint } from './Datapoint';

export type MappedDatapoint<T> = Pick<Datapoint<T>, 'data'>;
export type CombinedDatapoint<T, K> = MappedDatapoint<[T, K]>;

const mergeStatus = (a: Status, b: Status) => {
  if (a === b) return a;

  if (a === 'Loading' || b === 'Loading') return 'Loading';

  if (a === 'Error' || b === 'Error') return 'Error';

  return 'Idle';
};

export const map = <T, K>(a: MappedDatapoint<T>, f: (x: T) => K): MappedDatapoint<K> => {
  return {
    data: makeAutoObservable({
      get error() {
        return a.data.error;
      },
      get status() {
        return a.data.status;
      },
      get value() {
        return a.data.value && f(a.data.value);
      },
    }),
  };
};

export const chain = <T, K>(a: MappedDatapoint<T>, f: (a: T) => MappedDatapoint<K>) => {
  return map(map(a, f), (x) => x.data.value);
};

export const combine = <T, K>(a: MappedDatapoint<T>, b: MappedDatapoint<K>): CombinedDatapoint<T, K> => {
  return {
    data: makeAutoObservable({
      get error() {
        return a.data.error || b.data.error;
      },
      get value(): [T, K] | undefined {
        return a.data.value && b.data.value && [a.data.value, b.data.value];
      },
      get status() {
        const status = mergeStatus(a.data.status, b.data.status);

        return status;
      },
    }),
  };
};

export const merge = <T, K, R>(a: CombinedDatapoint<T, K>, f: (a: T, b: K) => R): MappedDatapoint<R> => {
  return map(a, ([a, b]) => f(a, b));
};
