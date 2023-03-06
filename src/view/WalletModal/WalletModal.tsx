import { FC } from 'react';
import { observer } from 'mobx-react-lite';
import { DialogDismiss } from 'ariakit';

import { Button, Modal, ModalProps } from 'lib/components';
import { CoinbaseLogo_SVG, MetaMaskLogo_SVG, WalletConnectLogo_SVG } from 'lib/icons';

import { type Action } from 'service/Action';
import type { ConnectorName } from 'service/Web3/types';

import styles from './WalletModal.module.scss';

type WalletModalProps = Omit<ModalProps, 'children' | 'title'> & {
  connect: Action<void, [ConnectorName], true>;
};

const WalletModal: FC<WalletModalProps> = observer(({ connect, state, ...rest }) => {
  const mkHandleClickConnect = (name: ConnectorName) => async () => {
    await connect.send(name);

    if (connect.data.status === 'Succeed') state.hide();
  };

  return (
    <Modal {...rest} state={state} title="Connect wallet">
      <ul className={styles['root']} aria-label="choose one of the options">
        <li>
          <DialogDismiss
            as={Button}
            text="MetaMask"
            icon={<MetaMaskLogo_SVG title="metaMask logo" width={30} height={26} />}
            onClick={mkHandleClickConnect('metamask')}
            stretch
          />
        </li>
        <li>
          <DialogDismiss
            as={Button}
            text="Coinbase"
            icon={<CoinbaseLogo_SVG title="coinbase logo" width={24} height={24} />}
            onClick={mkHandleClickConnect('coinbase')}
            stretch
          />
        </li>
        <li>
          <DialogDismiss
            as={Button}
            text="WalletConnect"
            icon={<WalletConnectLogo_SVG title="walletConnect logo" width={24} height={22} />}
            onClick={mkHandleClickConnect('walletConnect')}
            stretch
          />
        </li>
      </ul>
    </Modal>
  );
});

export { WalletModal };
