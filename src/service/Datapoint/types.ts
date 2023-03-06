import type { Token } from 'typedi';

import type { CancellableOrPromise } from 'lib/types/common';

import type { Datapoint } from './Datapoint';

export type DatapointParameters<T, D extends Array<unknown> = []> = {
  initial?: T;
  polling?: number;
  $deps?(): D;
  fetch(...args: [...deps: D, signal?: AbortSignal]): CancellableOrPromise<T>;
};

export type DatapointController<T, D extends Array<unknown> = []> = {
  (...args: [...deps: D, signal?: AbortSignal]): CancellableOrPromise<T>;
  token?: Token<Datapoint<T, D>>;
};

export type MappedDatapoint<T> = Pick<Datapoint<T>, 'data'>;

export type CombinedDatapoint<T, K> = MappedDatapoint<[T, K]>;
