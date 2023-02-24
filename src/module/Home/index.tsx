import { observer } from 'mobx-react-lite';
import Link from 'next/link';

import { ClientOnly } from 'lib/components';
import { inject } from 'lib/hocs/inject';
import { fetchData } from 'lib/utils';

import { IoCSale } from 'vm/Sale';

import { SaleForm } from 'view/SaleForm';

import { BaseLayout } from 'layout/BaseLayout';

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

Home.getLayout = (page) => (
  <BaseLayout
    vm={{
      address: fetchData<string>('0x378385D7911C40Db5E381BAfF1E50a4A7f1F3D7c'),
      openConnectModal() {
        console.log('open connect modal');
      },
      disconnect() {
        console.log('disconnect');
      },
    }}
    t
  >
    {page}
  </BaseLayout>
);
