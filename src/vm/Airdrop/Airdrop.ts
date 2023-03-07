import { type Address } from '@wagmi/core';
import { makeAutoObservable } from 'mobx';
import { Inject, Service } from 'typedi';

import { SalePhase } from 'lib/types/common';
import { AbstractFactory } from 'lib/types/AbstractFactory';

import { type Datapoint, InjectDatapoint, InjectDatapointFactory } from 'service/Datapoint';
import { airdropController } from 'service/Web3/controllers';
import { Wallet } from 'service/Wallet';

import type { IAirdrop } from './Interface';

@Service()
class Airdrop implements IAirdrop {
  allowedToMint = this.allowedToMintFactory.create(() => [this.wallet.address.data.value]);
  whitelisted = this.whitelistedFactory.create(() => [[], this.wallet.address.data.value]);

  constructor(
    @InjectDatapoint({ fetch: airdropController.getPhase })
    public phase: Datapoint<SalePhase>,
    @InjectDatapointFactory({ fetch: airdropController.getAllowedToMint })
    private allowedToMintFactory: AbstractFactory<
      [() => [Address | undefined]],
      Datapoint<number | undefined, [address: Address | undefined]>
    >,
    @InjectDatapointFactory({ fetch: airdropController.getWhitelisted })
    private whitelistedFactory: AbstractFactory<
      [() => [whitelist: Array<Address>, address: Address | undefined]],
      Datapoint<boolean | undefined, [Address | undefined]>
    >,
    @Inject() private wallet: Wallet,
  ) {
    makeAutoObservable(this);
  }
}

export { Airdrop };
