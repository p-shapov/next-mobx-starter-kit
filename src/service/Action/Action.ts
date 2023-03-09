import { action, FlowCancellationError, makeObservable, observable, runInAction } from 'mobx';

import { fetchData, getError } from 'lib/utils';

import { ActionParameters } from './types';

const mkAction = <T, D extends Array<unknown> = []>(params: ActionParameters<T, D>) => {
  return new Action<T, D>(params);
};

class Action<T, D extends Array<unknown> = []> {
  data = fetchData<T>();

  send = async (...args: D) => {
    const { fetch } = this.params;

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
        this.data.error = getError(error);
      });

      // eslint-disable-next-line no-console
      console.error(error);

      // propagate the error further for handle it outside
      throw error;
    }
  };

  cancel = () => {
    if (this.data.status === 'Loading') this.cancelFetch();
  };

  constructor(private params: ActionParameters<T, D>) {
    makeObservable(this, {
      data: observable.deep,
      send: action,
    });
  }

  private cancelFetch: () => void = () => void 0;
}

export { mkAction, type Action };
