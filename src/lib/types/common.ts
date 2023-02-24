import { type CancellablePromise } from 'mobx/dist/internal';

export type Status = 'Idle' | 'Loading' | 'Succeed' | 'Error';

export type SalePhase = 'Soon' | 'Started' | 'Finished';

export type FetchData<T> = {
  status: Status;
  value?: T;
  error: string | null;
};

export type CancellableOrPromise<T> = CancellablePromise<T> | Promise<T>;
