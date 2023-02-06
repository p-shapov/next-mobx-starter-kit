import { observer } from 'mobx-react-lite';
import { useMemo } from 'react';

import { PublicSaleForm, PublicSaleFormVM, PublicSaleModel } from 'feature/PublicSale';

export type Props = {
  phase: 'Soon' | 'Started' | 'Finished';
  price: number;
  supply: number;
};

export const Home: NextPageWithLayout<Props> = observer((data) => {
  const publicSaleModel = useMemo(() => {
    const model = new PublicSaleModel(true);
    model.hydrate(data);
    return model;
  }, [data]);
  const publicSaleFormVM = useMemo(() => new PublicSaleFormVM(publicSaleModel), [publicSaleModel]);

  return (
    <div>
      <PublicSaleForm vm={publicSaleFormVM} />

      <div>{publicSaleFormVM.json}</div>
    </div>
  );
});
