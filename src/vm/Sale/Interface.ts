import { type DataPoint, type FormField, type Form, type DataAction } from 'lib/mobx';
import { type SalePhase } from 'lib/types/common';

export interface ISale extends Form {
  readonly amount: FormField;
  readonly mint: DataAction<void, [number]>;
  readonly phase: DataPoint<SalePhase, []>;
  readonly price: DataPoint<number, []>;
  readonly supply: DataPoint<number, []>;
  readonly totalPrice: DataPoint<number, []>;
  increase(): void;
  decrease(): void;
}
