import { Service } from 'typedi';
import { type Address } from '@wagmi/core';
import { makeAutoObservable, onBecomeObserved, runInAction } from 'mobx';
import { setCookie } from 'typescript-cookie';

import { isServer } from 'lib/utils';

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

    if (!isServer) this.runConnectionAutoUpdate();
  }

  private runConnectionAutoUpdate = () => {
    const connected = !!web3Client.data?.account;

    if (!connected) {
      runInAction(() => {
        this.connect.data.status = 'Succeed';
      });
    }

    onBecomeObserved(this, 'address', () => {
      web3Client.subscribe((state) => state.data?.account, this.address.set);
    });

    web3Client.subscribe(
      (state) => !!state.data?.account,
      (connected) => setCookie('connected', connected),
    );
  };
}

export { Wallet };
