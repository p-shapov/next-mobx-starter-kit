import { flow } from 'mobx';

import { sleep } from 'lib/utils';
import { Action } from 'lib/mobx';

import { type ISaleMint } from './Interface';

const fetchMint = flow(function* (count: number) {
  yield sleep(2000);

  // eslint-disable-next-line no-console
  console.log(count);
});

export class PrivateSaleMint extends Action<void, [number]> implements ISaleMint {
  constructor(getDeps: () => [number]) {
    super({
      getFetch: () => fetchMint,
      getDeps,
    });
  }
}
