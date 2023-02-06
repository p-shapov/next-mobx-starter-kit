import { FetchData } from 'shared/types/common';

export const fetchData = <T, D = T>(value: D): FetchData<T, D> => ({
  value,
  status: 'Nothing',
  error: null,
});
