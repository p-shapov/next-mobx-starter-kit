import { observer } from 'mobx-react-lite';
import Link from 'next/link';

import { PublicSaleForm, PublicSaleFormVM, PublicSaleModel } from 'feature/PublicSale';

import { useHydrateStore } from 'shared/hooks/useHydrateStore';

export type Props = {
  phase: 'Soon' | 'Started' | 'Finished';
  price: number;
  supply: number;
};

const publicSaleModel = new PublicSaleModel({ isSsr: true });
const publicSaleFormVM = new PublicSaleFormVM(publicSaleModel);

export const Home: NextPageWithLayout<Props> = observer((data) => {
  useHydrateStore(data, publicSaleModel);

  return (
    <div>
      <PublicSaleForm vm={publicSaleFormVM} />

      <div>{publicSaleFormVM.json}</div>

      <Link href="/test/Soon">Soon</Link>
      <Link href="/test/Started">Started</Link>
      <Link href="/test/Finished">Finished</Link>
    </div>
  );
});
