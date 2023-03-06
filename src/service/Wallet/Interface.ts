import type { Address } from '@wagmi/core';

import type { Action } from 'service/Action';
import type { MappedDatapoint } from 'service/Datapoint/utils';
import type { ConnectorName } from 'service/Web3/types';

export interface IWallet {
  connect: Action<void, [ConnectorName], true>;
  disconnect: Action<void>;
  address: MappedDatapoint<Address | undefined>;
  connected: MappedDatapoint<boolean>;
}
