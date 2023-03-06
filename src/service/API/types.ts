import type { Token } from 'typedi';

import type { CancellableOrPromise } from 'lib/types/common';

import type { Action } from 'service/Action';

export type Controller<T, D extends Array<unknown> = []> = {
  (...args: [...D, AbortSignal]): CancellableOrPromise<T>;
  token?: Token<Action<T, D>>;
};
