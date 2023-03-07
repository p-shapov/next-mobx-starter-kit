import { FC, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { DialogDismiss } from 'ariakit';

import { Button, Modal, ModalProps } from 'lib/components';
import { CoinbaseLogo_SVG, MetaMaskLogo_SVG, WalletConnectLogo_SVG } from 'lib/icons';
import type { FetchData } from 'lib/types/common';

import type { ConnectorName } from 'service/Web3/types';

import styles from './WalletModal.module.scss';

type WalletModalProps = Omit<ModalProps, 'children' | 'title'> & {
  connection: FetchData<void>;
  onConnect(connectorName: ConnectorName): Promise<void>;
};

const WalletModal: FC<WalletModalProps> = observer(({ state, connection, onConnect, ...rest }) => {
  const [activeConnector, setActiveConnector] = useState<ConnectorName>();

  const mkHandleClickConnect = (connectorName: ConnectorName) => async () => {
    await onConnect(connectorName);

    setActiveConnector(undefined);
    state.hide();
  };

  return (
    <Modal {...rest} state={state} title="Connect wallet">
      <ul className={styles['root']} aria-label="choose one of the options">
        <li>
          <DialogDismiss
            as={Button}
            text="MetaMask"
            icon={<MetaMaskLogo_SVG title="metaMask logo" width="3rem" height="2.6rem" />}
            loading={activeConnector === 'metamask' && connection.status === 'Loading'}
            disabled={activeConnector !== 'metamask' && connection.status === 'Loading'}
            stretch
            onClick={mkHandleClickConnect('metamask')}
          />
        </li>
        <li>
          <DialogDismiss
            as={Button}
            text="Coinbase"
            icon={<CoinbaseLogo_SVG title="coinbase logo" width="2.4rem" height="2.4rem" />}
            loading={activeConnector === 'walletConnect' && connection.status === 'Loading'}
            disabled={activeConnector !== 'walletConnect' && connection.status === 'Loading'}
            stretch
            onClick={mkHandleClickConnect('coinbase')}
          />
        </li>
        <li>
          <DialogDismiss
            as={Button}
            text="WalletConnect"
            icon={<WalletConnectLogo_SVG title="walletConnect logo" width="2.4rem" height="2.2rem" />}
            loading={activeConnector === 'walletConnect' && connection.status === 'Loading'}
            disabled={activeConnector !== 'walletConnect' && connection.status === 'Loading'}
            stretch
            onClick={mkHandleClickConnect('walletConnect')}
          />
        </li>
      </ul>
    </Modal>
  );
});

export { WalletModal };
