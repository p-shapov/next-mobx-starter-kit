import { connect, type ConnectResult } from '@wagmi/core';
import { flow } from 'mobx';
import { Token } from 'typedi';

import { type ActionController } from 'service/Action';
import { network, web3Connectors } from 'service/Web3/config';

const connectMetamask: ActionController<ConnectResult> = flow(function* () {
  return yield connect({ connector: web3Connectors.metamask, chainId: network.id });
});

connectMetamask.token = new Token();

const connectCoinbase: ActionController<ConnectResult> = flow(function* () {
  return yield connect({ connector: web3Connectors.coinbase, chainId: network.id });
});

connectCoinbase.token = new Token();

const connectWalletConnect: ActionController<ConnectResult> = flow(function* () {
  return yield connect({ connector: web3Connectors.walletConnect, chainId: network.id });
});

connectWalletConnect.token = new Token();

export { connectMetamask, connectCoinbase, connectWalletConnect };
