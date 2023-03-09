import type { Token } from 'typedi';

import type { CancellableOrPromise } from 'lib/types/common';

import type { Datapoint } from './Datapoint';

export type DatapointParametersWithoutDeps<T> = {
  initial?: T;
  polling?: number;
  fetch(signal?: AbortSignal): CancellableOrPromise<T>;
};

export type DatapointParametersWithDeps<T, D extends Array<unknown> = []> = {
  initial?: T;
  polling?: number;
  $deps(): D;
  fetch(...args: [...deps: D, signal?: AbortSignal]): CancellableOrPromise<T>;
};

export type DatapointParameters<T, D extends Array<unknown> = []> = D extends []
  ? DatapointParametersWithoutDeps<T>
  : DatapointParametersWithDeps<T, D>;

export type DatapointController<T, D extends Array<unknown> = []> = {
  (...args: [...deps: D, signal?: AbortSignal]): CancellableOrPromise<T>;
  token?: Token<Datapoint<T, D>>;
};

export type MappedDatapoint<T, D extends Array<unknown> = []> = Pick<Datapoint<T, D>, 'data' | 'refetch'>;
