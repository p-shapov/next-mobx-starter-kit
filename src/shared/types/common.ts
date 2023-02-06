export type FetchData<T, D = T> = {
  status: 'Nothing' | 'Loading' | 'Succeed' | 'Error';
  value: T | D;
  error: string | null;
};
