/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { FC } from 'react';
import { Container, Token, type Constructable } from 'typedi';

export const inject = <T,>(Component: FC<T>) => {
  function makeComponent<D extends Token<any> | Constructable<any>, R extends Partial<T>>(
    identifier: D,
    map: (service: D extends Token<infer U> ? U : D extends Constructable<infer U> ? U : never) => R,
  ): FC<{ [P in keyof T as P extends keyof R ? never : P]: T[P] }> {
    const service: D extends Token<infer U> ? U : D extends Constructable<infer U> ? U : never =
      Container.get(identifier as any);

    return (rest) => <Component {...rest} {...(map(service) as any)} />;
  }

  return makeComponent;
};
