import { useRouter } from 'next/router';

import type { NextPageWithLayout } from 'lib/types/common';
import { inject } from 'lib/hocs';

import { Wallet } from 'service/Wallet';

import { ConnectButton as ConnectButtonComponent } from 'view/ConnectButton';

import { BaseLayout, WalletModal } from 'layout/BaseLayout';

import { saleLink } from './constants';

const ConnectButton = inject(ConnectButtonComponent)(Wallet, (wallet) => ({
  connect: wallet.connect,
  connected: wallet.connected,
}));

const Home: NextPageWithLayout = () => {
  const router = useRouter();

  return (
    <div>
      <ConnectButton Modal={WalletModal} link={{ ...saleLink, current: router.pathname === saleLink.href }} />
    </div>
  );
};

Home.getLayout = (page) => <BaseLayout>{page}</BaseLayout>;

export { Home };
