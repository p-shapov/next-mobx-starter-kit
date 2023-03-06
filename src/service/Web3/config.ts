import { type ClientConfig, configureChains } from '@wagmi/core';
import { polygonMumbai, polygon } from '@wagmi/core/chains';
import { alchemyProvider } from '@wagmi/core/providers/alchemy';
import { publicProvider } from '@wagmi/core/providers/public';
import { CoinbaseWalletConnector } from '@wagmi/core/connectors/coinbaseWallet';
import { MetaMaskConnector } from '@wagmi/core/connectors/metaMask';
import { WalletConnectConnector } from '@wagmi/core/connectors/walletConnect';

import { Env } from 'assets/constants';

const network = Env.IS_TESTNET ? polygonMumbai : polygon;

const { chains, provider, webSocketProvider } = configureChains(
  [network],
  [publicProvider(), alchemyProvider({ apiKey: Env.ALCHEMY_API_KEY })],
);

const web3Connectors = {
  metamask: new MetaMaskConnector({
    chains,
    options: {
      shimDisconnect: true,
      shimChainChangedDisconnect: true,
    },
  }),
  coinbase: new CoinbaseWalletConnector({
    chains,
    options: {
      appName: 'tothemetamoon',
      jsonRpcUrl: `https://eth-mainnet.alchemyapi.io/v2/${Env.ALCHEMY_API_KEY}`,
    },
  }),
  walletConnect: new WalletConnectConnector({ chains, options: { qrcode: true } }),
};

const web3Config: ClientConfig = {
  autoConnect: true,
  connectors: [web3Connectors.metamask, web3Connectors.coinbase, web3Connectors.walletConnect],
  provider,
  webSocketProvider,
};

export { web3Config, web3Connectors, network };
