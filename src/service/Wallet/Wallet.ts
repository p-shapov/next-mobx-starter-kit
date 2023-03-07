import { Service } from 'typedi';
import { type Address } from '@wagmi/core';
import { makeAutoObservable } from 'mobx';

import { type Action, InjectAction } from 'service/Action';
import { walletController } from 'service/Web3/controllers';
import { mkDatapoint } from 'service/Datapoint';
import { web3Client } from 'service/Web3';
import type { ConnectorName } from 'service/Web3/types';

import { IWallet } from './Interface';

@Service()
class Wallet implements IWallet {
  address = mkDatapoint<Address | undefined>({
    fetch: async () => web3Client.data?.account,
    $deps: () => [],
  });

  constructor(
    @InjectAction({
      fetch: walletController.connectWallet,
      unprepared: true,
    })
    public connect: Action<void, [connectorName: ConnectorName], true>,

    @InjectAction({ fetch: walletController.disconnect })
    public disconnect: Action<void, []>,
  ) {
    makeAutoObservable(this);

    web3Client.subscribe((state) => state.data?.account, this.address.refetch);

    const connected = web3Client.storage.getItem('connected');

    if (!connected) this.connect.data.status = 'Succeed';
  }
}

export { Wallet };
