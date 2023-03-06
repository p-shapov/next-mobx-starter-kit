import { type CancellablePromise } from 'mobx/dist/internal';
import { NextPage } from 'next';
import { ReactElement } from 'react';

export type NextPageWithLayout<P = object, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement, props: P) => ReactElement;
};

export type Status = 'Idle' | 'Loading' | 'Succeed' | 'Error';

export type SalePhase = 'Soon' | 'Started' | 'Finished';

export type FetchData<T> = {
  status: Status;
  value?: T;
  error: string | null;
};

export type CancellableOrPromise<T> = CancellablePromise<T> | Promise<T>;

export type LinkItem = {
  href: string;
  text: string;
  external?: boolean;
  current?: boolean;
};
