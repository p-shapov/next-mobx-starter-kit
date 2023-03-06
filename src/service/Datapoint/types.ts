import type { Token } from 'typedi';

import type { CancellableOrPromise } from 'lib/types/common';

import type { Datapoint } from './Datapoint';

export type DatapointParameters<T, D extends Array<unknown> = []> = {
  initial?: T;
  polling?: number;
  $deps?(): D;
  fetch(...args: [...D, AbortSignal | undefined]): CancellableOrPromise<T>;
};

export type DatapointController<T, D extends Array<unknown> = []> = {
  (...args: [...D, AbortSignal]): CancellableOrPromise<T>;
  token?: Token<Datapoint<T, D>>;
};
