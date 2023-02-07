import { useEffect, useMemo } from 'react';

export const useHydrateStore = <T, S extends { hydrate(data: T): void; dehydrate(): void }>(
  data: T,
  store: S,
) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useMemo(() => store.hydrate(data), []);

  useEffect(() => {
    store.dehydrate();
    store.hydrate(data);
  }, [data, store]);
};
