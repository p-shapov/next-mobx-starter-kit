import { observer } from 'mobx-react-lite';
import { FC } from 'react';

import { PublicSaleFormVM } from '../../vm/PublicSaleFormVM/PublicSaleFormVM';

export const PublicSaleForm: FC<{ vm: PublicSaleFormVM }> = observer(({ vm }) => {
  if (!vm.isLoaded) return <span>...loading</span>;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        vm.submit();
      }}
    >
      <div>
        <button type="button" onClick={vm.decrease}>
          -
        </button>
        {vm.count.value} / {vm.supply.value}
        <button type="button" onClick={vm.increase}>
          +
        </button>
      </div>

      <div>{vm.phase.value}</div>

      <div>Price: {vm.price.value}</div>
      <div>Total price: {vm.totalPrice.value}</div>

      <button type="submit">Mint</button>
    </form>
  );
});
