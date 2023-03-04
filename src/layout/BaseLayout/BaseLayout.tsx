import type { ReactNode } from 'react';
import NextImage from 'next/image';
import { useRouter } from 'next/router';
import classNames from 'classnames';

import logo_svg from 'public/images/logo.svg';

import { Button, Link, Menu } from 'lib/components';
import { trim } from 'lib/utils';
import { inject } from 'lib/hocs';

import { Wallet } from 'service/Wallet';

import styles from './BaseLayout.module.scss';
import { headerNav, myNftsLink } from './constants';

type Props = {
  wallet: Wallet;
  children: ReactNode;
  gradient?: 'diagonal' | 'linear';
};

const BaseLayout = inject(({ wallet, children, gradient = 'diagonal' }: Props) => {
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
              <NextImage src={logo_svg} alt="Metalamp" width={92} height={98} layout="fixed" priority />
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

            {wallet.address.value ? (
              <Menu
                text={trim(wallet.address.value, 5, 4)}
                label="open header menu"
                title="header menu"
                items={[
                  { ...myNftsLink, current: pathname === myNftsLink.href },
                  { text: 'Disconnect', onClick: wallet.disconnect },
                ]}
              />
            ) : (
              <Button text="Connect" onClick={wallet.connect} uppercase />
            )}
          </div>
        </header>

        <main className={styles['main']}>{children}</main>
      </div>
    </>
  );
})({
  wallet: Wallet,
});

export { BaseLayout };
