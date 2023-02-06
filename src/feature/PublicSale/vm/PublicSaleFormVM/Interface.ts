import { FormFieldVM, FormVM } from 'shared/mobx/FormVM';
import { FetchData } from 'shared/types/common';

export interface IPublicSaleFormVM extends FormVM {
  readonly count: FormFieldVM;
  readonly price: FetchData<number, null>;
  readonly supply: FetchData<number, null>;
  readonly phase: FetchData<'Soon' | 'Started' | 'Finished', null>;
  readonly isLoaded: boolean;
  readonly totalPrice: FetchData<number, null>;
  increase(): void;
  decrease(): void;
}
