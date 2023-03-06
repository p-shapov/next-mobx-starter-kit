import { useState, useEffect, type FC } from 'react';
import { type Address } from '@wagmi/core';
import { AnimatePresence, motion } from 'framer-motion';
import { observer } from 'mobx-react-lite';

import { Button, ClientOnly, Menu, type ModalProps, useModalState } from 'lib/components';
import { trim } from 'lib/utils';
import type { LinkItem } from 'lib/types/common';

import { type Action } from 'service/Action';
import { type MappedDatapoint } from 'service/Datapoint/utils';

type AccountButtonProps = {
  Modal: FC<Pick<ModalProps, 'state'>>;
  disconnect: Action<void>;
  connect: MappedDatapoint<void>;
  address: MappedDatapoint<Address | undefined>;
  links: Array<LinkItem>;
};

const AccountButton: FC<AccountButtonProps> = observer(({ Modal, connect, disconnect, address, links }) => {
  const modalState = useModalState();

  const [autoFocusEnabled, setAutoFocusEnabled] = useState(false);
  const [autoFocusWalletButton, setAutoFocusWalletButton] = useState(false);
  const [autoFocusWalletMenu, setAutoFocusWalletMenu] = useState(false);

  useEffect(() => {
    if (address.data.value && autoFocusEnabled) {
      setAutoFocusWalletButton(false);
      setAutoFocusWalletMenu(true);
      setAutoFocusEnabled(false);
    }
  }, [address.data.value, autoFocusEnabled]);

  const handleFocusWrapper = () => {
    setAutoFocusEnabled(true);
  };

  const handleClickMenuItem = async () => {
    await disconnect.send();
    setAutoFocusWalletButton(true);
    setAutoFocusWalletMenu(false);
  };

  return (
    <ClientOnly>
      <div onFocus={handleFocusWrapper}>
        <AnimatePresence mode="wait">
          {address.data.value ? (
            <motion.div
              key="address"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Menu
                text={trim(address.data.value, 5, 4)}
                label="open header menu"
                title="header menu"
                autoFocus={autoFocusWalletMenu}
                items={[
                  ...links.map((link) => ({ ...link, onClick: handleClickMenuItem })),
                  {
                    text: 'disconnect',
                    loading: disconnect.data.status === 'Loading',
                    onClick: handleClickMenuItem,
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
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Button
                text="Connect wallet"
                onClick={modalState.toggle}
                autoFocus={autoFocusWalletButton}
                loading={connect.data.status === 'Loading'}
                uppercase
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Modal state={modalState} />
    </ClientOnly>
  );
});

export { AccountButton };
