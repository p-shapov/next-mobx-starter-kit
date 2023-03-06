import { type ReactNode } from 'react';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import { type Address } from '@wagmi/core';
import { observer } from 'mobx-react-lite';

import { ADDRESS_PLACEHOLDER } from 'assets/constants';

import { Button, Link, Menu, useModalState } from 'lib/components';
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
  address: Datapoint<Address>;
  children: ReactNode;
  disconnect: Action<void>;
  gradient?: 'diagonal' | 'linear';
};

const WalletModal = inject(WalletModalComponent)(Wallet, (wallet) => ({
  connectMetamask: wallet.connectMetamask,
  connectCoinbase: wallet.connectCoinbase,
  connectWalletConnect: wallet.connectWalletConnect,
}));

const BaseLayout = inject(
  observer(({ address, children, disconnect, gradient = 'diagonal' }: BaseLayoutProps) => {
    const { pathname } = useRouter();
    const walletModalState = useModalState();

    return (
      <>
        <div className={classNames(styles['gradient'], styles[`gradient--type_${gradient}`])}>
          {gradient === 'diagonal' && <div className={styles['diagonal']} />}
        </div>

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

              {address.data.value ? (
                <Menu
                  text={
                    address.data.value && address.data.status !== 'Loading'
                      ? trim(address.data.value, 5, 4)
                      : trim(ADDRESS_PLACEHOLDER, 5, 4)
                  }
                  label="open header menu"
                  title="header menu"
                  items={[
                    { ...myNftsLink, current: pathname === myNftsLink.href },
                    {
                      text: 'disconnect',
                      onClick: disconnect.send,
                      loading: disconnect.data.status === 'Loading',
                    },
                  ]}
                />
              ) : (
                <Button text="Connect" onClick={walletModalState.toggle} uppercase />
              )}
            </div>
          </header>

          <main className={styles['main']}>{children}</main>

          <WalletModal state={walletModalState} />
        </div>
      </>
    );
  }),
)(Wallet, (wallet) => ({
  address: wallet.address,
  disconnect: wallet.disconnect,
}));

export { BaseLayout };
