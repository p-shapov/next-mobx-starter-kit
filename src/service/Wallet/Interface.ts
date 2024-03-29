import type { Address } from '@wagmi/core';

import type { Action } from 'service/Action';
import type { Datapoint } from 'service/Datapoint';

export interface IWallet {
  address: Datapoint<Address | undefined>;
  connectMetamask: Action<void>;
  connectCoinbase: Action<void>;
  connectWalletConnect: Action<void>;
  disconnect: Action<void>;
}
