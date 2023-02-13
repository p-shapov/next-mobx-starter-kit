import { FetchData } from 'lib/types/common';

export const fetchData = <T>(value: T | null): FetchData<T> => ({
  value,
  status: 'Idle',
  error: null,
});
