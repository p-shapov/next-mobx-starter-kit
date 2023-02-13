import { type PostDataPoint, type FormFieldVM, type FormVM, type GetDataPoint } from 'lib/mobx';
import { type SalePhase } from 'lib/types/common';

export interface ISaleVM extends FormVM {
  readonly amount: FormFieldVM;
  readonly price: GetDataPoint<number, []>;
  readonly supply: GetDataPoint<number, []>;
  readonly totalPrice: Pick<GetDataPoint<number, []>, 'data'>;
  readonly phase: GetDataPoint<SalePhase, [unknown]>;
  readonly mint: PostDataPoint<void, [number]>;
  increase(): void;
  decrease(): void;
}
