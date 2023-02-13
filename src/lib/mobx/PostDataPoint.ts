import { action, makeObservable, observable, runInAction } from 'mobx';

import { fetchData, getErrorMessage } from 'lib/utils';

export class PostDataPoint<T, D extends Array<unknown>> {
  @observable readonly data = fetchData<T>(null);

  @action.bound
  async send() {
    const fetch = this.params.getFetch();
    const args = this.getDeps();

    if (fetch && args) {
      this.data.status = 'Loading';

      try {
        const data = await fetch(...args);

        runInAction(() => {
          this.data.status = 'Succeed';
          this.data.value = data;
        });
      } catch (error) {
        this.data.status = 'Error';
        this.data.error = getErrorMessage(error);
      }
    }
  }

  @action.bound
  injectDeps(getDeps: () => D) {
    this.getDeps = getDeps;
  }

  constructor(
    private readonly params: {
      getFetch(): ((...args: D) => Promise<T>) | null | undefined;
      getDeps(): D | null | undefined;
    },
  ) {
    makeObservable(this);
  }

  @observable protected getDeps: () => D | null | undefined = () => null;
}
