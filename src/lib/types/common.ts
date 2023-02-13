export type Status = 'Idle' | 'Loading' | 'Succeed' | 'Error';

export type SalePhase = 'Soon' | 'Started' | 'Finished';

export type FetchData<T> = {
  status: Status;
  value: T | null;
  error: string | null;
};
