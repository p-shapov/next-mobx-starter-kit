import type { NextPageWithLayout } from 'lib/types/common';
import { inject } from 'lib/hocs';

import { Airdrop } from 'vm/Airdrop';

import { ClaimAirdrop as ClaimAirdropComponent } from 'view/ClaimAirdrop';

import { BaseLayout } from 'layout/BaseLayout';

const ClaimAirdrop = inject(ClaimAirdropComponent)(Airdrop, (service) => ({
  phase: service.phase.data,
  allowedToMint: service.allowedToMint.data,
  whitelisted: service.whitelisted.data,
}));

const Sale: NextPageWithLayout = () => {
  return <ClaimAirdrop />;
};

Sale.getLayout = (page) => <BaseLayout content={page} gradient="linear" />;

export { Sale };
