import { flow, makeObservable } from 'mobx';
import { Service } from 'typedi';

import { sleep } from 'lib/utils';
import { PostDataPoint } from 'lib/mobx';

import { type ISaleMintDP } from './Interface';
import { IoCTypes } from './IoCTypes';

const fetchMint = flow(function* (count: number) {
  yield sleep(2000);

  // eslint-disable-next-line no-console
  console.log(count);
});

@Service(IoCTypes.IPrivateSaleMintDP)
export class PrivateSaleMintDP extends PostDataPoint<void, [number]> implements ISaleMintDP {
  constructor() {
    super({
      getFetch: () => fetchMint,
      getDeps: () => null,
    });
    makeObservable(this);
  }
}
