import { action, computed, makeObservable, observable } from 'mobx';

import { autoFetchable, type AutoFetchableParameters } from './AutoFetchable';

export abstract class GetDataPoint<T, D extends Array<unknown>> {
  fetcher = autoFetchable<T, D>({
    ...this.params,
    getDeps: () => this.getDeps(),
  });

  @computed
  get data() {
    return this.fetcher.data;
  }

  @action.bound
  injectDeps(getDeps: () => D) {
    this.getDeps = getDeps;
  }

  constructor(private readonly params: AutoFetchableParameters<T, D>) {
    makeObservable(this);
  }

  @observable protected getDeps = this.params.getDeps;
}
