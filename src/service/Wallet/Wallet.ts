import { Service } from 'typedi';
import { type Address } from '@wagmi/core';

import { type Action, InjectAction } from 'service/Action';
import { walletController } from 'service/Web3/controllers';
import { mkDatapoint } from 'service/Datapoint';
import { web3Client } from 'service/Web3';

import { IWallet } from './Interface';

@Service()
class Wallet implements IWallet {
  address = mkDatapoint<Address | undefined>({
    fetch: async () => web3Client.data?.account,
    $deps: () => [],
  });

  constructor(
    @InjectAction(walletController.connectMetamask.token, { fetch: walletController.connectMetamask })
    public connectMetamask: Action<void>,

    @InjectAction(walletController.connectCoinbase.token, { fetch: walletController.connectCoinbase })
    public connectCoinbase: Action<void>,

    @InjectAction(walletController.connectWalletConnect.token, {
      fetch: walletController.connectWalletConnect,
    })
    public connectWalletConnect: Action<void>,

    @InjectAction(walletController.disconnect.token, { fetch: walletController.disconnect })
    public disconnect: Action<void, []>,
  ) {
    web3Client.subscribe((state) => state.data?.account, this.address.set);
  }
}

export { Wallet };
