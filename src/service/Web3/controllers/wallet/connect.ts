import { connect, type ConnectResult } from '@wagmi/core';
import { flow } from 'mobx';
import { Token } from 'typedi';

import type { ActionController } from 'service/Action/types';
import { network, web3Connectors } from 'service/Web3/config';
import { ConnectorName } from 'service/Web3/types';

const connectWallet: ActionController<ConnectResult, [ConnectorName]> = flow(function* (connectorName) {
  switch (connectorName) {
    case 'metamask':
      return yield connectMetamask();
    case 'coinbase':
      return yield connectCoinbase();
    case 'walletConnect':
      return yield connectWalletConnect();
  }
});

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

export { connectWallet, connectMetamask, connectCoinbase, connectWalletConnect };
