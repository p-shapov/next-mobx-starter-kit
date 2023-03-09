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

import { fetchData, getError, isServer } from 'lib/utils';

import type { DatapointParameters } from './types';

const mkDatapoint = <T, D extends Array<unknown> = []>(
  params: DatapointParameters<T, D>,
): Datapoint<T, D> => {
  return new Datapoint<T, D>(params);
};

class Datapoint<T, D extends Array<unknown> = []> {
  data = fetchData<T>(this.params.initial);

  set = (value: T) => {
    runInAction(() => {
      this.data.value = value;
      this.data.status = 'Succeed';
    });
  };

  refetch = async (...deps: D) => {
    const { fetch } = this.params;

    const abortController = new AbortController();

    this.cancelFetch();

    this.data.status = 'Loading';

    try {
      const awaitedData = fetch(...deps, abortController.signal);

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
        this.data.error = getError(error);
      });

      // eslint-disable-next-line no-console
      console.error(error);
    }
  };

  constructor(private params: DatapointParameters<T, D>) {
    makeObservable(this, {
      data: observable.deep,
      refetch: action,
    });

    if (!isServer) {
      this.runAutoFetcher();
      this.runPolling();
    }
  }

  private runAutoFetcher = () => {
    const disposeInterval: () => void = () => void 0;

    onBecomeObserved(this, 'data', () => {
      this.disposeDepsListener = reaction(
        () => this.params.$deps?.() || [],
        async (deps) => {
          if (deps) {
            const { fetch } = this.params;

            const abortController = new AbortController();

            this.cancelFetch();

            runInAction(() => {
              this.data.status = 'Loading';
            });

            try {
              const awaitedData = fetch(...deps, abortController.signal);

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
                this.data.error = getError(error);
              });

              // eslint-disable-next-line no-console
              console.error(error);
            }
          }
        },
        { fireImmediately: true },
      );
    });

    onBecomeUnobserved(this, 'data', () => {
      this.disposeDepsListener();
      this.cancelFetch();
      disposeInterval();
    });
  };

  private runPolling = () => {
    onBecomeObserved(this, 'data', () => {
      this.clearPollingTimer();

      const { fetch, $deps, polling } = this.params;

      if (polling && $deps) {
        const deps = $deps();

        const timer = setInterval(async () => {
          const abortController = new AbortController();

          this.cancelFetch();

          runInAction(() => {
            this.data.status = 'Loading';
          });

          try {
            const awaitedData = fetch(...deps, abortController.signal);

            const data = await awaitedData;

            this.cancelFetch = () => {
              if ('cancel' in awaitedData) awaitedData.cancel();
              abortController.abort();
            };

            runInAction(() => {
              this.data.status = 'Succeed';
              this.data.value = data;
            });
          } catch (error) {
            if (error instanceof FlowCancellationError) return;

            runInAction(() => {
              this.data.status = 'Error';
              this.data.error = getError(error);
            });

            // eslint-disable-next-line no-console
            console.error(error);
          }
        }, polling);

        this.clearPollingTimer = () => clearInterval(timer);
      }
    });

    onBecomeUnobserved(this, 'data', () => {
      this.clearPollingTimer();
    });
  };

  private clearPollingTimer: () => void = () => void 0;
  private disposeDepsListener: () => void = () => void 0;
  private cancelFetch: () => void = () => void 0;
}

export { mkDatapoint, type Datapoint };
