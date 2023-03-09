import { type FC } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { observer } from 'mobx-react-lite';
import { DialogDisclosure } from 'ariakit';

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
    const modalState = useModalState();

    return (
      <>
        <div className={styles['root']}>
          <AnimatePresence mode="wait">
            {connected ? (
              <motion.div
                key="link"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <ButtonLink {...link} text="Start minting" stretch uppercase />
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
                  stretch
                  uppercase
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <Modal state={modalState} connection={connection} onConnect={onConnect} />
      </>
    );
  },
);

export { ConnectButton };
