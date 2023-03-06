import { Service } from 'typedi';
import { type Address } from '@wagmi/core';

import { ADDRESS_PLACEHOLDER } from 'assets/constants';

import { type Action, InjectAction } from 'service/Action';
import { walletController } from 'service/Web3/controllers';
import { mkDatapoint } from 'service/Datapoint';
import { web3Client } from 'service/Web3';

import { IWallet } from './Interface';

@Service()
export class Wallet implements IWallet {
  address = mkDatapoint<Address>({ fetch: async () => ADDRESS_PLACEHOLDER });

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
    this.disconnect.send();

    web3Client;
  }
}
