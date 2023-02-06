/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  onBecomeObserved,
  onBecomeUnobserved,
  runInAction,
  reaction,
  makeObservable,
  action,
  observable,
} from 'mobx';
import { CancellablePromise } from 'mobx/dist/internal';

import { fetchData } from 'shared/utils/fetchData';
import { getErrorMessage } from 'shared/utils/getErrorMessage';
import { isServer } from 'shared/utils/isServer';

type FetchResult<T> = CancellablePromise<T> | Promise<T>;

export const autoFetchable = <
  T extends Parameters<NonNullable<Parameters<ReturnType<ReturnType<F1>>['then']>[0]>>[0],
  F1 extends { (): (...args: Array<any>) => FetchResult<any> },
  F2 extends { (): Readonly<Parameters<ReturnType<F1>>> | undefined | null },
>({
  getFetch,
  isSsr,
  getDeps,
}: {
  readonly isSsr?: boolean;
  readonly getFetch: F1;
  readonly getDeps: F2;
}): AutoFetchable<T, F1, F2> => {
  return new AutoFetchable<T, F1, F2>(getFetch, getDeps, isSsr);
};

export class AutoFetchable<
  T extends Parameters<NonNullable<Parameters<ReturnType<ReturnType<F1>>['then']>[0]>>[0],
  F1 extends { (): (...args: Array<any>) => FetchResult<any> },
  F2 extends { (): Readonly<Parameters<ReturnType<F1>>> | undefined | null },
> {
  public data = fetchData<T, null>(null);

  public forceUpdate(value: T) {
    runInAction(() => {
      this.data.status = 'Succeed';
      this.data.value = value;
    });
  }

  public readonly hydrate = (value: T) => {
    if (this.isSsr) {
      if (!this.hydrated) this.forceUpdate(value);
    }
  };

  constructor(private readonly getFetch: F1, private readonly getDeps: F2, private readonly isSsr?: boolean) {
    makeObservable(this, {
      data: observable,
      forceUpdate: action.bound,
    });

    this.runAutoFetcher();
  }

  private hydrated = false;

  private readonly runAutoFetcher = () => {
    let disposeListener: () => void = () => void 0;
    let cancelFetch: () => void = () => void 0;

    onBecomeObserved(this, 'data', () => {
      disposeListener = reaction(
        () => [this.getFetch(), this.getDeps()] as const,
        async ([fetch, args]) => {
          if (args && ((!isServer && this.hydrated) || !this.isSsr)) {
            cancelFetch();

            this.data.status = 'Loading';

            try {
              const awaitedData = fetch(...args);

              if ('cancel' in awaitedData) cancelFetch = awaitedData.cancel;

              const data = await awaitedData;

              runInAction(() => {
                this.data.status = 'Succeed';
                this.data.value = data;
              });
            } catch (error) {
              runInAction(() => {
                this.data.status = 'Error';
                this.data.error = getErrorMessage(error);
              });
            }
          }

          if (this.isSsr && !isServer && !this.hydrated) {
            this.hydrated = true;
          }
        },
        { fireImmediately: true },
      );
    });

    onBecomeUnobserved(this, 'data', () => {
      disposeListener();
      cancelFetch();
    });
  };
}
