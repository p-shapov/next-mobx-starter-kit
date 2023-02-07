import { useEffect, useMemo } from 'react';

export const useHydrateStore = <T>(data: T, store: { hydrate(data: T): void; dehydrate(): void }) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useMemo(() => store.hydrate(data), []);

  useEffect(() => {
    store.dehydrate();
    store.hydrate(data);
  }, [data, store]);
};
