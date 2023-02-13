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
  readonly getFetch: { (): ((...args: [...D, AbortSignal]) => CancellableOrPromise<T>) | null };
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
      const abortController = new AbortController();

      this.cancelFetch();

      this.data.status = 'Loading';

      try {
        const awaitedData = fetch(...args, abortController.signal);

        this.cancelFetch = () => {
          if ('cancel' in awaitedData) awaitedData.cancel();
          abortController.abort();
        };

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
  }

  __runAutoFetcher__() {
    onBecomeObserved(this, 'data', () => {
      this.disposeListener = reaction(
        () => [this.params.getFetch(), this.params.getDeps()] as const,
        async ([fetch, args]) => {
          if (fetch && args) {
            const abortController = new AbortController();

            this.cancelFetch();

            this.data.status = 'Loading';

            try {
              const awaitedData = fetch(...args, abortController.signal);

              this.cancelFetch = () => {
                if ('cancel' in awaitedData) awaitedData.cancel();
                abortController.abort();
              };

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
      this.disposeListener();
      this.cancelFetch();
    });
  }

  private disposeListener: () => void = () => void 0;
  private cancelFetch: () => void = () => void 0;
}
