import { type FC, useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';

import { Button, Modal, ModalProps } from 'lib/components';
import { CoinbaseLogo_SVG, MetaMaskLogo_SVG, WalletConnectLogo_SVG } from 'lib/icons';
import type { FetchData } from 'lib/types/common';
import { sleep } from 'lib/utils';

import type { ConnectorName } from 'service/Web3/types';

import styles from './WalletModal.module.scss';

type WalletModalProps = Omit<ModalProps, 'children' | 'title'> & {
  connection: FetchData<void>;
  onConnect(connectorName: ConnectorName): Promise<void>;
};

const WalletModal: FC<WalletModalProps> = observer(({ state, connection, onConnect, ...rest }) => {
  const [activeConnector, setActiveConnector] = useState<ConnectorName>();

  useEffect(() => {
    if (connection.error) {
      setActiveConnector(undefined);
    }
  }, [connection.error]);

  const mkHandleClickConnect = (connectorName: ConnectorName) => async () => {
    setActiveConnector(connectorName);

    try {
      await onConnect(connectorName);

      setActiveConnector(undefined);

      if (typeof state.animated === 'number') {
        await sleep(state.animated);
      }

      state.hide();
    } catch (error) {
      // TODO :: handle error
    }
  };

  return (
    <Modal
      {...rest}
      state={state}
      title="Connect wallet"
      disableOutsideClick={activeConnector === 'coinbase' || activeConnector === 'metaMask'}
    >
      <ul className={styles['root']} aria-label="choose one of the options">
        <li>
          <Button
            text="MetaMask"
            icon={<MetaMaskLogo_SVG title="metaMask logo" width="3rem" height="2.6rem" />}
            loading={activeConnector === 'metaMask' && connection.status === 'Loading'}
            disabled={activeConnector !== 'metaMask' && connection.status === 'Loading'}
            stretch
            onClick={mkHandleClickConnect('metaMask')}
          />
        </li>
        <li>
          <Button
            text="Coinbase"
            icon={<CoinbaseLogo_SVG title="coinbase logo" width="2.4rem" height="2.4rem" />}
            loading={activeConnector === 'coinbase' && connection.status === 'Loading'}
            disabled={activeConnector !== 'coinbase' && connection.status === 'Loading'}
            stretch
            onClick={mkHandleClickConnect('coinbase')}
          />
        </li>
        <li>
          <Button
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
