import { useRouter } from 'next/router';
import { Heading } from 'ariakit';
import { AnimatePresence, motion } from 'framer-motion';

import type { NextPageWithLayout } from 'lib/types/common';
import { inject } from 'lib/hocs';
import { MetalampLogo_SVG } from 'lib/icons';

import { Wallet } from 'service/Wallet';
import { map } from 'service/Datapoint/utils';

import { ConnectButton as ConnectButtonComponent } from 'view/ConnectButton';
import { WhitelistButton } from 'view/WhitelistButton';
import { WalletModal } from 'view/WalletModal';
import { Orbit as OrbitComponent } from 'view/Orbit';

import { BaseLayout } from 'layout/BaseLayout';

import { saleLink } from './constants';
import styles from './Home.module.scss';

const Orbit = inject(OrbitComponent)(Wallet, (wallet) => ({
  connection: wallet.connect.data,
  connected: map(wallet.address, (address) => !!address).data.value,
}));

const ConnectButton = inject(ConnectButtonComponent)(Wallet, (wallet) => ({
  connection: wallet.connect.data,
  connected: map(wallet.address, (address) => !!address).data.value,
  onConnect: wallet.connect.send,
}));

const Home: NextPageWithLayout = () => {
  const router = useRouter();

  return (
    <div className={styles['root']}>
      <Heading className={styles['title']} aria-label="To the MetaMoon">
        To the
        <br />M
        <span>
          <MetalampLogo_SVG width="6.9rem" height="7.4rem" />
        </span>
        taMoon
      </Heading>

      <p className={styles['description']}>
        From the creators of the first
        <br />
        Cardano NFT-marketplace
      </p>

      <div className={styles['buttons']}>
        <ConnectButton
          Modal={WalletModal}
          link={{ ...saleLink, current: router.pathname === saleLink.href }}
        />
        <WhitelistButton />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Orbit />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

Home.getLayout = (page) => <BaseLayout content={page} />;

export { Home };
