import {
  onBecomeObserved,
  onBecomeUnobserved,
  runInAction,
  reaction,
  makeObservable,
  observable,
  action,
  FlowCancellationError,
  computed,
} from 'mobx';

import { fetchData, getErrorMessage, isServer } from 'lib/utils';
import { CancellableOrPromise } from 'lib/types/common';

export type DatapointParameters<T, D extends Array<unknown> = []> = (D extends []
  ? {
      fetch(...args: [AbortSignal | undefined]): CancellableOrPromise<T>;
    }
  : {
      $deps(): D;
      fetch(...args: [...D, AbortSignal | undefined]): CancellableOrPromise<T>;
    }) & {
  initial?: T;
  polling?: number;
};

export const mkDatapoint = <T, D extends Array<unknown> = []>(params: DatapointParameters<T, D>) => {
  return new Datapoint<T, D>(params);
};
export class Datapoint<T, D extends Array<unknown> = []> {
  data = fetchData<T>(this.params.initial);

  map = <K>(f: (val: T) => K): Datapoint<K, D> => {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this;

    return makeObservable(
      {
        map: <U>(g: (val: K) => U) => {
          return self.map((val: T) => g(f(val)));
        },
        get data() {
          return {
            ...self.data,
            value: self.data.value && f(self.data.value),
          };
        },
      },
      {
        data: computed,
      },
    ) as Datapoint<K, D>;
  };

  set = (value: T) => {
    this.data.status = 'Succeed';
    this.data.value = value;
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
        this.data.error = getErrorMessage(error);
      });
    }
  };

  constructor(private params: DatapointParameters<T, D>) {
    makeObservable(this, {
      data: observable,
      set: action,
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
        () => this.params.$deps?.() || ([] as const),
        async (deps) => {
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
              this.data.error = getErrorMessage(error);
            });
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
      const deps = $deps?.() || [];

      if (polling) {
        const timer = setInterval(async () => {
          this.data.status = 'Loading';

          try {
            const awaitedData = fetch(...(deps as [...D, AbortSignal]));

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
