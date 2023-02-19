import { FC, type ReactNode } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import classNames from 'classnames';

import logo_svg from 'public/images/logo.svg';

import { Button, Link, Menu } from 'lib/components';
import { type FetchData } from 'lib/types/common';
import { trim } from 'lib/utils';

import styles from './BaseLayout.module.scss';
import { headerNav, myNftsLink } from './constants';

export type BaseLayoutProps = {
  vm: {
    address: FetchData<string>;
    openConnectModal(): void;
    disconnect(): void;
  };
  children: ReactNode;
  gradient?: 'diagonal' | 'linear';
};

export const BaseLayout: FC<BaseLayoutProps> = ({ vm, children, gradient = 'diagonal' }) => {
  const { pathname } = useRouter();

  return (
    <>
      <div className={classNames(styles['gradient'], styles[`gradient--type_${gradient}`])}>
        {gradient === 'diagonal' && <div className={styles['diagonal']} />}
      </div>

      <div className={styles['root']}>
        <header className={styles['header']}>
          <span className={styles['logo']}>
            <Link href="/" current={pathname === '/'}>
              <Image src={logo_svg} alt="Metalamp" width={92} height={98} layout="fixed" priority />
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

            {vm.address.value ? (
              <Menu
                text={trim(vm.address.value, 5, 4)}
                label="open header menu"
                title="header menu"
                items={[
                  { ...myNftsLink, current: pathname === myNftsLink.href },
                  { text: 'Disconnect', onClick: vm.disconnect },
                ]}
              />
            ) : (
              <Button text="Connect" onClick={vm.openConnectModal} uppercase />
            )}
          </div>
        </header>

        <main className={styles['main']}>{children}</main>
      </div>
    </>
  );
};
