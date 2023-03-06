import { FC } from 'react';
import { observer } from 'mobx-react-lite';

import { Button, Modal, ModalProps } from 'lib/components';
import { CoinbaseLogo_SVG, MetaMaskLogo_SVG, WalletConnectLogo_SVG } from 'lib/icons';

import { type Action } from 'service/Action';

import styles from './WalletModal.module.scss';

type WalletModalProps = Omit<ModalProps, 'children' | 'title'> & {
  connectMetamask: Action<void>;
  connectCoinbase: Action<void>;
  connectWalletConnect: Action<void>;
};

const WalletModal: FC<WalletModalProps> = observer(
  ({ connectMetamask, connectCoinbase, connectWalletConnect, state, ...rest }) => {
    const connectWallet = (name: 'metamask' | 'coinbase' | 'walletConnect') => async () => {
      switch (name) {
        case 'metamask': {
          await connectMetamask.send();

          if (connectMetamask.data.status === 'Succeed') state.hide();

          break;
        }
        case 'coinbase': {
          await connectCoinbase.send();

          if (connectCoinbase.data.status === 'Succeed') state.hide();

          break;
        }
        case 'walletConnect': {
          await connectWalletConnect.send();

          if (connectWalletConnect.data.status === 'Succeed') state.hide();

          break;
        }
      }
    };

    return (
      <Modal
        {...rest}
        state={state}
        outsideClickClose={
          connectMetamask.data.status !== 'Loading' && connectCoinbase.data.status !== 'Loading'
        }
        title="Connect wallet"
      >
        <ul className={styles['root']} aria-label="choose one of the options">
          <li>
            <Button
              text="MetaMask"
              icon={<MetaMaskLogo_SVG title="metaMask logo" width={30} height={26} />}
              onClick={connectWallet('metamask')}
              loading={connectMetamask.data.status === 'Loading'}
              disabled={
                connectCoinbase.data.status === 'Loading' || connectWalletConnect.data.status === 'Loading'
              }
              stretch
            />
          </li>
          <li>
            <Button
              text="Coinbase"
              icon={<CoinbaseLogo_SVG title="coinbase logo" width={24} height={24} />}
              onClick={connectWallet('coinbase')}
              loading={connectCoinbase.data.status === 'Loading'}
              disabled={
                connectMetamask.data.status === 'Loading' || connectWalletConnect.data.status === 'Loading'
              }
              stretch
            />
          </li>
          <li>
            <Button
              text="WalletConnect"
              icon={<WalletConnectLogo_SVG title="walletConnect logo" width={24} height={22} />}
              onClick={connectWallet('walletConnect')}
              loading={connectWalletConnect.data.status === 'Loading'}
              disabled={
                connectMetamask.data.status === 'Loading' || connectCoinbase.data.status === 'Loading'
              }
              stretch
            />
          </li>
        </ul>
      </Modal>
    );
  },
);

export { WalletModal };
