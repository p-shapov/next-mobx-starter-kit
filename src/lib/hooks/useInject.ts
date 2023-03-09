import { useMemo } from 'react';
import { type Token, type Constructable, Container } from 'typedi';

export const useInject = <T>(identifier: Token<T> | Constructable<T>) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const service = useMemo(() => Container.get<T>(identifier as any), [identifier]);

  return service;
};
