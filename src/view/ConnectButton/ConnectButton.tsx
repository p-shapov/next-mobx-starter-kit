import { useEffect, useState, type FC } from 'react';
import { observer } from 'mobx-react-lite';
import { AnimatePresence, motion } from 'framer-motion';

import { ButtonLink, Button, type ModalProps, useModalState } from 'lib/components';
import type { LinkItem } from 'lib/types/common';

import { type MappedDatapoint } from 'service/Datapoint/utils';

type ConnectButtonProps = {
  Modal: FC<Pick<ModalProps, 'state'>>;
  connect: MappedDatapoint<void>;
  connected: MappedDatapoint<boolean>;
  link: LinkItem;
};

const ConnectButton: FC<ConnectButtonProps> = observer(({ Modal, connect, link, connected }) => {
  const [autoFocusEnabled, setAutoFocusEnabled] = useState(false);
  const [autoFocusConnectButton, setAutoFocusConnectButton] = useState(false);
  const [autoFocusLink, setAutoFocusLink] = useState(false);

  const modalState = useModalState();

  const handleClickConnectWallet = () => {
    modalState.show();
  };

  useEffect(() => {
    if (connected?.data.value && autoFocusEnabled) {
      setAutoFocusConnectButton(false);
      setAutoFocusLink(true);
      setAutoFocusEnabled(false);
    }
  }, [connected.data.value, autoFocusEnabled]);

  const handleFocusWrapper = () => {
    setAutoFocusEnabled(true);
  };

  return (
    <div>
      <div onFocus={handleFocusWrapper}>
        <AnimatePresence mode="wait">
          {connected.data.value ? (
            <motion.div
              key="link"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <ButtonLink {...link} text="Start minting" autoFocus={autoFocusLink} uppercase />
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
                onClick={handleClickConnectWallet}
                autoFocus={autoFocusConnectButton}
                loading={connect.data.status === 'Loading'}
                uppercase
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Modal state={modalState} />
    </div>
  );
});

export { ConnectButton };
