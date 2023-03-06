import type { Token } from 'typedi';

import type { CancellableOrPromise } from 'lib/types/common';

import type { Action } from './Action';

export type ActionParameters<T, D extends Array<unknown> = [], I extends boolean = false> = {
  deps?: D;
  unprepared?: I;
  fetch(...args: [...D, AbortSignal | undefined]): CancellableOrPromise<T>;
};

export type ActionController<T, D extends Array<unknown> = []> = {
  (...args: [...D, AbortSignal]): CancellableOrPromise<T>;
  token?: Token<Action<T, D>>;
};
