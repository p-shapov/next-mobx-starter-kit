import { disconnect as disconnectWallet } from '@wagmi/core';
import { flow } from 'mobx';
import { Token } from 'typedi';

import type { ActionController } from 'service/Action/types';

const disconnect: ActionController<void> = flow(function* () {
  return yield disconnectWallet();
});

disconnect.token = new Token();

export { disconnect };
