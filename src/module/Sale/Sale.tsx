import { pipe } from 'fp-ts/function';
import { observer } from 'mobx-react-lite';
import { Heading, VisuallyHidden } from 'ariakit';

import type { NextPageWithLayout } from 'lib/types/common';
import { clientOnly, inject } from 'lib/hocs';
import { useInject } from 'lib/hooks';

import { Airdrop } from 'vm/Airdrop';

import { ClaimAirdrop as ClaimAirdropView } from 'view/ClaimAirdrop';

import { BaseLayout } from 'layout/BaseLayout';
import { TabsLayout } from 'layout/TabsLayout/TabsLayout';

const ClaimAirdrop = pipe(
  ClaimAirdropView,
  clientOnly,
  inject(Airdrop, (service) => ({
    phase: service.phase.data,
    allowedToMint: service.allowedToMint.data,
    whitelisted: service.whitelisted.data,
  })),
);

const Sale: NextPageWithLayout = observer(() => {
  const airdrop = useInject(Airdrop);
  const privateSale = useInject(Airdrop);
  const publicSale = useInject(Airdrop);

  return (
    <>
      <VisuallyHidden>
        <Heading>Sale</Heading>
      </VisuallyHidden>

      <TabsLayout
        items={[
          {
            title: 'Airdrop',
            badge: {
              text: airdrop.phase.data.value || 'Loading...',
              color: airdrop.phase.data.value === 'Started' ? 'green' : 'violet',
            },
            href: '/sale/airdrop',
            content: <ClaimAirdrop />,
          },
          {
            title: 'Private Sale',
            badge: {
              text: privateSale.phase.data.value || 'Loading...',
              color: privateSale.phase.data.value === 'Started' ? 'green' : 'violet',
            },
            href: '/sale/private',
            content: <ClaimAirdrop />,
          },
          {
            title: 'Public Sale',
            badge: {
              text: publicSale.phase.data.value || 'Loading...',
              color: publicSale.phase.data.value === 'Started' ? 'green' : 'violet',
            },
            href: '/sale/public',
            content: <ClaimAirdrop />,
          },
        ]}
      />
    </>
  );
});

Sale.getLayout = (page) => <BaseLayout content={page} gradient="linear" title="Sale - To the MetaMoon" />;

export { Sale };
