import { type ReactNode, FC } from 'react';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';

import { Link } from 'lib/components';
import { inject } from 'lib/hocs';
import { MetalampLogo_SVG } from 'lib/icons';

import { Wallet } from 'service/Wallet';

import { WalletModal as WalletModalComponent } from 'view/WalletModal';
import { AccountButton as AccountButtonComponent } from 'view/AccountButton';

import styles from './BaseLayout.module.scss';
import { headerLinks, accountLinks } from './constants';

type BaseLayoutProps = {
  content: ReactNode;
  gradient?: 'diagonal' | 'linear';
};

const WalletModal = inject(WalletModalComponent)(Wallet, (wallet) => ({
  connect: wallet.connect,
}));

const AccountButton = inject(AccountButtonComponent)(Wallet, (wallet) => ({
  connect: wallet.connect,
  disconnect: wallet.disconnect,
  address: wallet.address,
}));

const BaseLayout: FC<BaseLayoutProps> = ({ content, gradient = 'diagonal' }) => {
  const router = useRouter();

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
              />
            </div>
          </div>
        </header>

        <main className={styles['main']}>{content}</main>
      </div>
    </>
  );
};

export { BaseLayout, WalletModal };
