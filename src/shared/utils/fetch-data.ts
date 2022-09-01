import { FetchData } from 'shared/types/fetch-data';

export const fetchData = <T, D = T>(value: D): FetchData<T, D> => ({
  value,
  status: 'nothing',
  error: null,
});
