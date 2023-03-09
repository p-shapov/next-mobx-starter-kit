import type { Token } from 'typedi';

import type { CancellableOrPromise } from 'lib/types/common';

import type { Action } from './Action';

export type MappedAction<T, D extends Array<unknown> = []> = Pick<Action<T, D>, 'data' | 'send' | 'cancel'>;

export type ActionParameters<T, D extends Array<unknown> = []> = {
  fetch(...args: [...deps: D, signal?: AbortSignal]): CancellableOrPromise<T>;
};

export type ActionController<T, D extends Array<unknown> = []> = {
  (...args: [...deps: D, signal?: AbortSignal]): CancellableOrPromise<T>;
  token?: Token<Action<T, D>>;
};
