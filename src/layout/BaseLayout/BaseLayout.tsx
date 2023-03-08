import { type ReactNode, FC } from 'react';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import NextImage from 'next/image';
import NextHead from 'next/head';
import { observer } from 'mobx-react-lite';

import { Link } from 'lib/components';
import { clientOnly, inject } from 'lib/hocs';
import { MetalampLogo_SVG } from 'lib/icons';

import { Wallet } from 'service/Wallet';

import { WalletModal } from 'view/WalletModal';
import { AccountButton as AccountButtonComponent, AccountButtonFallback } from 'view/AccountButton';

import styles from './BaseLayout.module.scss';
import { headerLinks, accountLinks, socialLinks } from './constants';

type BaseLayoutProps = {
  content: ReactNode;
  redirectOnDisconnectHref?: string;
  gradient?: 'diagonal' | 'linear';
};

const AccountButton = observer(
  inject(clientOnly(AccountButtonComponent, AccountButtonFallback))(Wallet, (wallet) => ({
    address: wallet.address.data,
    connection: wallet.connect.data,
    disconnection: wallet.disconnect.data,
    onConnect: wallet.connect.send,
    onDisconnect: wallet.disconnect.send,
  })),
);

const BaseLayout: FC<BaseLayoutProps> = ({ content, redirectOnDisconnectHref, gradient = 'diagonal' }) => {
  const router = useRouter();

  return (
    <>
      <NextHead>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#9465c6" />
        <meta name="msapplication-TileColor" content="#9465c6" />
        <meta name="theme-color" content="#000000" />
      </NextHead>

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
            transition={{ duration: 0.5 }}
          />
        )}
      </AnimatePresence>

      <div className={styles['root']}>
        <header className={styles['header']}>
          <span className={styles['logo']}>
            <Link href="/" current={router.pathname === '/'}>
              <MetalampLogo_SVG title="Metalamp logo" width={92} height={98} />
            </Link>
          </span>

          <div className={styles['links']}>
            <nav>
              <ul>
                {headerLinks.map(({ text, ...rest }, idx) => (
                  <li key={idx}>
                    <Link {...rest} current={rest.href === router.pathname}>
                      {text}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className={styles['wallet']}>
              <AccountButton
                Modal={WalletModal}
                links={accountLinks.map((link) => ({ ...link, current: link.href === router.pathname }))}
                redirectOnDisconnectHref={redirectOnDisconnectHref}
              />
            </div>
          </div>
        </header>

        <main className={styles['main']}>{content}</main>

        <footer>
          <ul className={styles['socials']}>
            {socialLinks.map(({ alt, src, href }, idx) => (
              <li key={idx}>
                <Link href={href} external>
                  <NextImage src={src} alt={alt} width={40} height={40} quality={100} priority />
                </Link>
              </li>
            ))}
          </ul>
        </footer>
      </div>
    </>
  );
};

export { BaseLayout };
