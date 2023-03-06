import { Service } from 'typedi';
import { type Address } from '@wagmi/core';
import { makeAutoObservable } from 'mobx';

import { type Action, InjectAction } from 'service/Action';
import { walletController } from 'service/Web3/controllers';
import { mkDatapoint } from 'service/Datapoint';
import { web3Client } from 'service/Web3';
import { map, MappedDatapoint } from 'service/Datapoint/utils';
import type { ConnectorName } from 'service/Web3/types';

import { IWallet } from './Interface';

@Service()
class Wallet implements IWallet {
  get address(): MappedDatapoint<`0x${string}` | undefined> {
    return map(this._address, (x) => x);
  }

  get connected(): MappedDatapoint<boolean> {
    return map(this.address, (x) => !!x);
  }

  constructor(
    @InjectAction(walletController.connectWallet.token, {
      fetch: walletController.connectWallet,
      unprepared: true,
    })
    public connect: Action<void, [ConnectorName], true>,

    @InjectAction(walletController.disconnect.token, { fetch: walletController.disconnect })
    public disconnect: Action<void, []>,
  ) {
    makeAutoObservable(this);

    web3Client.subscribe((state) => state.data?.account, this._address.refetch);
  }

  private _address = mkDatapoint<Address | undefined>({
    fetch: async () => web3Client.data?.account,
    $deps: () => [],
  });
}

export { Wallet };
