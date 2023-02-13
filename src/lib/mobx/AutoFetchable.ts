import {
  onBecomeObserved,
  onBecomeUnobserved,
  runInAction,
  reaction,
  makeObservable,
  observable,
  action,
  FlowCancellationError,
} from 'mobx';

import { fetchData, getErrorMessage, isServer } from 'lib/utils';
import { CancellableOrPromise } from 'lib/types/common';

export type AutoFetchableParameters<T, D extends Array<unknown>> = {
  readonly getFetch: { (): ((...args: D) => CancellableOrPromise<T>) | null };
  readonly getDeps: { (): D | undefined | null };
  readonly initial?: T;
};

export const autoFetchable = <T, D extends Array<unknown>>({
  getFetch,
  getDeps,
  initial,
}: AutoFetchableParameters<T, D>) => {
  return new AutoFetchable<T, D>({ getFetch, getDeps, initial });
};

export class AutoFetchable<T, D extends Array<unknown>> {
  @observable
  readonly data = fetchData<T>(this.params.initial || null);

  constructor(private readonly params: AutoFetchableParameters<T, D>) {
    makeObservable(this);

    if (!isServer) this.__runAutoFetcher__();
  }

  @action.bound
  async __forceUpdate__(...args: D) {
    const fetch = this.params.getFetch();

    if (fetch) {
      this.data.status = 'Loading';

      try {
        const data = await fetch(...args);

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
  }

  __runAutoFetcher__() {
    let disposeListener: () => void = () => void 0;
    let cancelFetch: () => void = () => void 0;

    onBecomeObserved(this, 'data', () => {
      disposeListener = reaction(
        () => [this.params.getFetch(), this.params.getDeps()] as const,
        async ([fetch, args]) => {
          if (fetch && args) {
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
              if (error instanceof FlowCancellationError) return;

              runInAction(() => {
                this.data.status = 'Error';
                this.data.error = getErrorMessage(error);
              });
            }
          }
        },
        { fireImmediately: true },
      );
    });

    onBecomeUnobserved(this, 'data', () => {
      disposeListener();
      cancelFetch();
    });
  }
}
