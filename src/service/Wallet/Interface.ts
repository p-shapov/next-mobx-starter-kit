import type { Action } from 'service/Action';
import type { Datapoint } from 'service/Datapoint';

export interface IWallet {
  address: Datapoint<string>;
  connectMetamask: Action<void>;
  connectCoinbase: Action<void>;
  connectWalletConnect: Action<void>;
  disconnect: Action<void>;
}
