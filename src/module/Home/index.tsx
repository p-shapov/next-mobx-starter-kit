import { observer } from 'mobx-react-lite';
import Link from 'next/link';

import { ClientOnly } from 'lib/components';
import { inject } from 'lib/hocs/inject';

import { IoCSale } from 'vm/Sale';

import { SaleForm } from 'view/SaleForm';

const PublicSaleForm = inject(SaleForm)({
  vm: IoCSale.IPublicSale,
});

export const Home: NextPageWithLayout = observer(() => {
  return (
    <div>
      <ClientOnly>
        <PublicSaleForm />
      </ClientOnly>

      <Link href="/test/Soon">Soon</Link>
      <Link href="/test/Started">Started</Link>
      <Link href="/test/Finished">Finished</Link>
    </div>
  );
});
