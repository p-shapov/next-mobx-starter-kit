import type { SalePhase } from 'lib/types/common';

import type { Form, FormField } from 'service/Form';
import type { Datapoint } from 'service/Datapoint';
import type { Action } from 'service/Action';

export interface ISale extends Form {
  amount: FormField<number>;
  mint: Action<void, [number]>;
  phase: Datapoint<SalePhase, []>;
  price: Datapoint<number, []>;
  supply: Datapoint<number, []>;
  totalPrice: Datapoint<number, []>;
  increase(): void;
  decrease(): void;
}
