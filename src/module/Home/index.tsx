import { ClientOnly } from 'lib/components';
import { inject } from 'lib/hocs';
import { NextPageWithLayout } from 'lib/types/common';

import { PrivateSale, PublicSale } from 'vm/Sale';

import { SaleForm } from 'view/SaleForm';

import { BaseLayout } from 'layout/BaseLayout';

const PublicSaleForm = inject(SaleForm)(PublicSale);

const PrivateSaleForm = inject(SaleForm)(PrivateSale);

export const Home: NextPageWithLayout = () => {
  return (
    <ClientOnly>
      <PublicSaleForm />
      <PrivateSaleForm />
    </ClientOnly>
  );
};

Home.getLayout = (page) => <BaseLayout>{page}</BaseLayout>;
