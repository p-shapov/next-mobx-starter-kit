import { action, FlowCancellationError, makeObservable, observable, runInAction } from 'mobx';

import { fetchData, getErrorMessage } from 'lib/utils';
import { CancellableOrPromise } from 'lib/types/common';

export class PostDataPoint<T, D extends Array<unknown>> {
  @observable readonly data = fetchData<T>(null);

  @action.bound
  async send() {
    const fetch = this.params.getFetch();
    const args = this.getDeps();

    if (fetch && args) {
      this.cancelFetch();

      this.data.status = 'Loading';

      try {
        const awaitedData = fetch(...args);

        if ('cancel' in awaitedData) this.cancelFetch = awaitedData.cancel;

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

  @action.bound
  injectDeps(getDeps: () => D) {
    this.getDeps = getDeps;
  }

  constructor(
    private readonly params: {
      getFetch(): ((...args: D) => CancellableOrPromise<T>) | null | undefined;
      getDeps(): D | null | undefined;
    },
  ) {
    makeObservable(this);
  }

  @observable protected getDeps = this.params.getDeps;

  private cancelFetch: () => void = () => void 0;
}
