import { useState, useEffect, type FC } from 'react';
import { type Address } from '@wagmi/core';
import { AnimatePresence, motion } from 'framer-motion';
import { observer } from 'mobx-react-lite';

import { Button, Menu, type ModalProps, useModalState } from 'lib/components';
import { trim } from 'lib/utils';
import type { FetchData, LinkItem } from 'lib/types/common';

import type { ConnectorName } from 'service/Web3/types';

type AccountButtonProps = {
  Modal: FC<Pick<ModalProps, 'state'> & Pick<AccountButtonProps, 'connection' | 'onConnect'>>;
  address: FetchData<Address | undefined>;
  connection: FetchData<void>;
  disconnection: FetchData<void>;
  links: Array<LinkItem>;
  onConnect(connectorName: ConnectorName): Promise<void>;
  onDisconnect(): Promise<void>;
};

const AccountButton: FC<AccountButtonProps> = observer(
  ({ Modal, address, connection, disconnection, links, onConnect, onDisconnect }) => {
    const modalState = useModalState();

    const [autoFocusEnabled, setAutoFocusEnabled] = useState(false);
    const [autoFocusWalletButton, setAutoFocusWalletButton] = useState(false);
    const [autoFocusWalletMenu, setAutoFocusWalletMenu] = useState(false);

    useEffect(() => {
      if (address.value && autoFocusEnabled) {
        setAutoFocusWalletButton(false);
        setAutoFocusWalletMenu(true);
        setAutoFocusEnabled(false);
      }
    }, [address.value, autoFocusEnabled]);

    const handleFocusWrapper = () => {
      setAutoFocusEnabled(true);
    };

    const handleClickDisconnectButton = async () => {
      await onDisconnect();
      setAutoFocusWalletButton(true);
      setAutoFocusWalletMenu(false);
    };

    return (
      <>
        <div onFocus={handleFocusWrapper}>
          <AnimatePresence mode="wait" initial={address.status !== 'Succeed'}>
            {address.value ? (
              <motion.div
                key="address"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Menu
                  text={trim(address.value, 5, 4)}
                  label="open header menu"
                  title="header menu"
                  autoFocus={autoFocusWalletMenu}
                  items={[
                    ...links,
                    {
                      text: 'disconnect',
                      loading: disconnection.status === 'Loading',
                      onClick: handleClickDisconnectButton,
                    },
                  ]}
                />
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
                    onClick={modalState.toggle}
                    autoFocus={autoFocusWalletButton}
                    loading={connection.status === 'Loading'}
                    uppercase
                  />
                </motion.div>
              )
            )}
          </AnimatePresence>
        </div>

        <Modal state={modalState} connection={connection} onConnect={onConnect} />
      </>
    );
  },
);

export { AccountButton };
