import { disconnect as disconnectWallet } from '@wagmi/core';
import { flow } from 'mobx';
import { Token } from 'typedi';

import { type ActionController } from 'service/Action';

export const disconnect: ActionController<void> = flow(function* () {
  return yield disconnectWallet();
});

disconnect.token = new Token();
