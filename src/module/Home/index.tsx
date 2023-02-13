import { observer } from 'mobx-react-lite';
import Link from 'next/link';

import { ClientOnly } from 'lib/components';
import { inject } from 'lib/hocs/inject';

import * as SaleVM from 'vm/SaleVM';

import { SaleForm } from 'view/SaleForm';

const PublicSaleForm = inject(SaleForm)({
  vm: SaleVM.IoCTypes.IPublicSaleVM,
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
