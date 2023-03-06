import { action, FlowCancellationError, makeObservable, observable, runInAction } from 'mobx';

import { fetchData, getErrorMessage } from 'lib/utils';

import { ActionParameters } from './types';

const mkAction = <T, D extends Array<unknown> = [], I extends boolean = false>(
  params: ActionParameters<T, D, I>,
) => {
  return new Action<T, D, I>(params);
};

class Action<T, D extends Array<unknown> = [], I extends boolean = false> {
  data = fetchData<T>();

  send = async (...args: I extends true ? D : []) => {
    const { fetch } = this.params;
    const deps = this.params.unprepared ? args : this.params.deps || [];

    if (deps) {
      const abortController = new AbortController();

      this.cancelFetch();

      this.data.status = 'Loading';

      try {
        const awaitedData = fetch(...(deps as D), abortController.signal);

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
  };

  cancel = () => {
    if (this.data.status === 'Loading') this.cancelFetch();
  };

  constructor(private params: ActionParameters<T, D, I>) {
    makeObservable(this, {
      data: observable,
      send: action,
    });
  }

  private cancelFetch: () => void = () => void 0;
}

export { mkAction, type Action };
