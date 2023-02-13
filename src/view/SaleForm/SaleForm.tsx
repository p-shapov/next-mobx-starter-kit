import { observer } from 'mobx-react-lite';
import { FC } from 'react';

import { withPreventDefault } from 'lib/utils/withPreventDefault';

import { ISaleVM } from 'vm/SaleVM';

export type SaleFormProps = {
  vm: ISaleVM;
};

export const SaleForm: FC<SaleFormProps> = observer(({ vm }) => {
  return (
    <form onSubmit={withPreventDefault(vm.mint.send)}>
      <div>
        <button type="button" onClick={vm.decrease}>
          -
        </button>
        {vm.amount.value} /{' '}
        {vm.supply.data.status !== 'Succeed' ? vm.supply.data.status : vm.supply.data.value}
        <button type="button" onClick={vm.increase}>
          +
        </button>
      </div>

      <div>Phase: {vm.phase.data.status !== 'Succeed' ? vm.phase.data.status : vm.supply.data.value}</div>
      <div>Price: {vm.price.data.status !== 'Succeed' ? vm.price.data.status : vm.price.data.value}</div>
      <div>
        Total price:{' '}
        {vm.totalPrice.data.status !== 'Succeed' ? vm.totalPrice.data.status : vm.totalPrice.data.value}
      </div>

      <button type="submit">Mint {vm.mint.data.status}</button>
    </form>
  );
});