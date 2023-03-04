import { FetchData } from 'lib/types/common';

export interface IWallet {
  address: FetchData<string>;
  connect(): void;
  disconnect(): void;
}
