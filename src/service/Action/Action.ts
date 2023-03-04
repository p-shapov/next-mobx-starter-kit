import { action, FlowCancellationError, makeObservable, observable, runInAction } from 'mobx';

import { fetchData, getErrorMessage } from 'lib/utils';
import { CancellableOrPromise } from 'lib/types/common';

export type ActionParameters<T, D extends Array<unknown> = []> = D extends []
  ? {
      fetch(...args: [AbortSignal]): CancellableOrPromise<T>;
    }
  : {
      fetch(...args: [...D, AbortSignal]): CancellableOrPromise<T>;
      getDeps(): D;
    };

export const mkAction = <T, D extends Array<unknown> = []>(params: ActionParameters<T, D>) => {
  return new Action(params);
};

export class Action<T, D extends Array<unknown> = []> {
  data = fetchData<T>();

  send = async () => {
    const { fetch, getDeps } = this.params;
    const deps = getDeps?.() || [];

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

  cancel = () => {
    if (this.data.status === 'Loading') this.cancelFetch();
  };

  constructor(private params: ActionParameters<T, D>) {
    makeObservable(this, {
      data: observable,
      send: action,
    });
  }

  private cancelFetch: () => void = () => void 0;
}
