import { type ReactNode, type FC } from 'react';
import { Dialog, DialogDismiss, DialogHeading, useDialogState, type DialogState } from 'ariakit/dialog';

import { Close_SVG } from 'lib/icons';

import styles from './Modal.module.scss';

type ModalProps = {
  state: DialogState;
  children: ReactNode;
  title: string;
  autoFocus?: boolean;
  outsideClickClose?: boolean;
};

const Modal: FC<ModalProps> = ({ title, state, children, outsideClickClose = true }) => {
  return (
    <Dialog
      state={state}
      className={styles['root']}
      modal
      hideOnInteractOutside={outsideClickClose}
      backdropProps={{
        className: styles['backdrop'],
      }}
    >
      <DialogHeading className={styles['title']}>{title}</DialogHeading>

      <DialogDismiss className={styles['close']}>
        <Close_SVG width="4rem" height="4rem" title="Close" />
      </DialogDismiss>

      <div>{children}</div>
    </Dialog>
  );
};

const useModalState = () => useDialogState({ animated: 600 });

export { Modal, useModalState, type ModalProps };
