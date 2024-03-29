import { type ReactNode, useState, useEffect, FC } from 'react';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import { type Address } from '@wagmi/core';
import { observer } from 'mobx-react-lite';
import { AnimatePresence, motion } from 'framer-motion';

import { ADDRESS_PLACEHOLDER } from 'assets/constants';

import { Button, ClientOnly, Link, Menu, useModalState } from 'lib/components';
import { trim } from 'lib/utils';
import { inject } from 'lib/hocs';
import { MetalampLogo_SVG } from 'lib/icons';

import { Wallet } from 'service/Wallet';
import { type Datapoint } from 'service/Datapoint';
import { type Action } from 'service/Action';

import { WalletModal as WalletModalComponent } from 'view/WalletModal';

import styles from './BaseLayout.module.scss';
import { headerNav, myNftsLink } from './constants';

type BaseLayoutProps = {
  address: Datapoint<Address | undefined>;
  children: ReactNode;
  disconnect: Action<void>;
  gradient?: 'diagonal' | 'linear';
};

const WalletModal = inject(WalletModalComponent)(Wallet, (wallet) => ({
  connectMetamask: wallet.connectMetamask,
  connectCoinbase: wallet.connectCoinbase,
  connectWalletConnect: wallet.connectWalletConnect,
}));

const BaseLayoutComponent: FC<BaseLayoutProps> = observer(
  ({ address, children, disconnect, gradient = 'diagonal' }) => {
    const { pathname } = useRouter();
    const walletModalState = useModalState();

    const [autoFocusWalletEnabled, setWalletAutoFocusEnabled] = useState(false);

    const [autoFocusWalletConnect, setAutoFocusWalletConnect] = useState(false);
    const [autoFocusWalletMenu, setAutoFocusWalletMenu] = useState(false);

    const handleFocusWalletWrapper = () => {
      setWalletAutoFocusEnabled(true);
    };

    useEffect(() => {
      if (address.data.value && autoFocusWalletEnabled) {
        setAutoFocusWalletConnect(false);
        setAutoFocusWalletMenu(true);
      }
    }, [address.data.value, autoFocusWalletEnabled]);

    return (
      <>
        <AnimatePresence mode="popLayout">
          {gradient === 'diagonal' ? (
            <motion.div
              key="diagonal"
              className={classNames(styles['gradient'], styles[`gradient--type_diagonal`])}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              {gradient === 'diagonal' && <div className={styles['diagonal']} />}
            </motion.div>
          ) : (
            <motion.div
              key="linear"
              className={classNames(styles['gradient'], styles[`gradient--type_linear`])}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            />
          )}
        </AnimatePresence>

        <div className={styles['root']}>
          <header className={styles['header']}>
            <span className={styles['logo']}>
              <Link href="/" current={pathname === '/'}>
                <MetalampLogo_SVG title="Metalamp logo" width={92} height={98} />
              </Link>
            </span>

            <div className={styles['links']}>
              <nav>
                <ul>
                  {headerNav.map(({ text, ...rest }, idx) => (
                    <li key={idx}>
                      <Link {...rest} current={rest.href === pathname}>
                        {text}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              <div className={styles['wallet']} onFocus={handleFocusWalletWrapper}>
                <ClientOnly>
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
                          text={
                            address.data.value && address.data.status !== 'Loading'
                              ? trim(address.data.value, 5, 4)
                              : trim(ADDRESS_PLACEHOLDER, 5, 4)
                          }
                          label="open header menu"
                          title="header menu"
                          autoFocus={autoFocusWalletMenu}
                          items={[
                            { ...myNftsLink, current: pathname === myNftsLink.href },
                            {
                              text: 'disconnect',
                              async onClick() {
                                await disconnect.send();
                                setAutoFocusWalletConnect(true);
                                setAutoFocusWalletMenu(false);
                              },
                              loading: disconnect.data.status === 'Loading',
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
                          onClick={walletModalState.toggle}
                          autoFocus={autoFocusWalletConnect}
                          uppercase
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </ClientOnly>
              </div>
            </div>
          </header>

          <main className={styles['main']}>{children}</main>

          <WalletModal state={walletModalState} />
        </div>
      </>
    );
  },
);

const BaseLayout = inject(BaseLayoutComponent)(Wallet, (wallet) => ({
  address: wallet.address,
  disconnect: wallet.disconnect,
}));

export { BaseLayout };
