import { FetchData } from 'shared/types/common';

export interface IPublicSaleModel {
  readonly price: FetchData<number, null>;
  readonly supply: FetchData<number, null>;
  readonly phase: FetchData<'Soon' | 'Started' | 'Finished', null>;
  mint(count: number): Promise<void>;
}
