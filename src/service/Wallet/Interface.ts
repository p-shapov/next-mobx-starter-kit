import type { Address } from '@wagmi/core';

import type { Action } from 'service/Action';
import type { Datapoint } from 'service/Datapoint';
import type { ConnectorName } from 'service/Web3/types';

export interface IWallet {
  address: Datapoint<Address | undefined>;
  connect: Action<void, [wallet: ConnectorName]>;
  disconnect: Action<void>;
}
