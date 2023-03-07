import { useEffect, useState, type FC } from 'react';
import { observer } from 'mobx-react-lite';
import { AnimatePresence, motion } from 'framer-motion';

import { ButtonLink, Button, type ModalProps, useModalState } from 'lib/components';
import type { FetchData, LinkItem } from 'lib/types/common';

import type { ConnectorName } from 'service/Web3/types';

import styles from './ConnectButton.module.scss';

type ConnectButtonProps = {
  Modal: FC<Pick<ModalProps, 'state'> & Pick<ConnectButtonProps, 'connection' | 'onConnect'>>;
  connection: FetchData<void>;
  connected?: boolean;
  link: LinkItem;
  onConnect(connectorName: ConnectorName): Promise<void>;
};

const ConnectButton: FC<ConnectButtonProps> = observer(
  ({ Modal, connection, connected, link, onConnect }) => {
    const [autoFocusEnabled, setAutoFocusEnabled] = useState(false);
    const [autoFocusConnectButton, setAutoFocusConnectButton] = useState(false);
    const [autoFocusLink, setAutoFocusLink] = useState(false);

    const walletModal = useModalState();

    useEffect(() => {
      if (connected && autoFocusEnabled) {
        setAutoFocusConnectButton(false);
        setAutoFocusLink(true);
        setAutoFocusEnabled(false);
      }
    }, [connected, autoFocusEnabled]);

    const handleClickConnectButton = () => {
      walletModal.show();
    };

    const handleFocusWrapper = () => {
      setAutoFocusEnabled(true);
    };

    return (
      <>
        <div className={styles['root']} onFocus={handleFocusWrapper}>
          <AnimatePresence mode="wait" initial={connection.status !== 'Succeed'}>
            {connected ? (
              <motion.div
                key="link"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <ButtonLink {...link} text="Start minting" autoFocus={autoFocusLink} stretch uppercase />
              </motion.div>
            ) : (
              connection.status !== 'Idle' && (
                <motion.div
                  key="connect"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Button
                    text="Connect wallet"
                    onClick={handleClickConnectButton}
                    autoFocus={autoFocusConnectButton}
                    loading={connection.status === 'Loading'}
                    stretch
                    uppercase
                  />
                </motion.div>
              )
            )}
          </AnimatePresence>
        </div>

        <Modal state={walletModal} connection={connection} onConnect={onConnect} />
      </>
    );
  },
);

export { ConnectButton };
