import { type Address } from '@wagmi/core';
import { AnimatePresence, motion } from 'framer-motion';
import { observer } from 'mobx-react-lite';
import { DialogDisclosure } from 'ariakit';
import { type FC } from 'react';

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

    const handleDisconnectButtonClick = () => {
      try {
        onDisconnect();
      } catch (error) {
        // TODO :: handle error
      }
    };

    return (
      <>
        <AnimatePresence mode="wait">
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
                label="account"
                items={[
                  ...links,
                  {
                    text: 'disconnect',
                    loading: disconnection.status === 'Loading',
                    onClick: handleDisconnectButtonClick,
                  },
                ]}
              />
            </motion.div>
          ) : (
            <motion.div
              key="connect"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.5,
                delay: typeof modalState.animated === 'number' ? modalState.animated / 1000 : 0,
              }}
            >
              <DialogDisclosure
                as={Button}
                state={modalState}
                text="Connect wallet"
                loading={connection.status === 'Loading'}
                uppercase
              />
            </motion.div>
          )}
        </AnimatePresence>

        <Modal state={modalState} connection={connection} onConnect={onConnect} />
      </>
    );
  },
);

export { AccountButton };
