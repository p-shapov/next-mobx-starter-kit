import { observer } from 'mobx-react-lite';

import type { NextPageWithLayout } from 'lib/types/common';
import { clientOnly, inject } from 'lib/hocs';

import { Airdrop } from 'vm/Airdrop';

import { ClaimAirdrop as ClaimAirdropComponent } from 'view/ClaimAirdrop';

import { BaseLayout } from 'layout/BaseLayout';

const ClaimAirdrop = observer(
  inject(clientOnly(ClaimAirdropComponent))(Airdrop, (service) => ({
    phase: service.phase.data,
    allowedToMint: service.allowedToMint.data,
    whitelisted: service.whitelisted.data,
  })),
);

const Sale: NextPageWithLayout = () => {
  return <ClaimAirdrop />;
};

Sale.getLayout = (page) => <BaseLayout content={page} gradient="linear" redirectOnDisconnectHref="/" />;

export { Sale };
