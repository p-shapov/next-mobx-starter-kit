import { observer } from 'mobx-react-lite';
import { FC } from 'react';

import { withPreventDefault } from 'lib/utils/withPreventDefault';
import { useLogger } from 'lib/hooks';

import { ISale } from 'vm/Sale';

export type SaleFormProps = ISale;

export const SaleForm: FC<SaleFormProps> = observer((vm) => {
  useLogger('dd', vm.totalPrice.data.status);

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

      <div>Phase: {vm.phase.data.status !== 'Succeed' ? vm.phase.data.status : vm.phase.data.value}</div>
      <div>Price: {vm.price.data.status !== 'Succeed' ? vm.price.data.status : vm.price.data.value}</div>
      <div>
        Total price:{' '}
        {vm.totalPrice.data.status !== 'Succeed' ? vm.totalPrice.data.status : vm.totalPrice.data.value}
      </div>
      <div>Error: {vm.phase.data.error}</div>

      <button type="submit">Mint {vm.mint.data.status}</button>
    </form>
  );
});
