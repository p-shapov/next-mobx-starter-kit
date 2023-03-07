import { useRouter } from 'next/router';
import { Heading } from 'ariakit';

import type { NextPageWithLayout } from 'lib/types/common';
import { inject } from 'lib/hocs';
import { MetalampLogo_SVG } from 'lib/icons';

import { Wallet } from 'service/Wallet';

import { ConnectButton as ConnectButtonComponent } from 'view/ConnectButton';
import { WhitelistButton } from 'view/WhitelistButton';

import { BaseLayout, WalletModal } from 'layout/BaseLayout';

import { saleLink } from './constants';
import { Orbit as OrbitComponent } from './Orbit';
import styles from './Home.module.scss';

const Orbit = inject(OrbitComponent)(Wallet, (wallet) => ({
  connected: wallet.connected,
}));

const ConnectButton = inject(ConnectButtonComponent)(Wallet, (wallet) => ({
  connect: wallet.connect,
  connected: wallet.connected,
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

      <Orbit />
    </div>
  );
};

Home.getLayout = (page) => <BaseLayout content={page} />;

export { Home };
