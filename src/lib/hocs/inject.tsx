/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { FC } from 'react';
import { Container, Token, type Constructable } from 'typedi';

export const inject = <T,>(Component: FC<T>) => {
  function makeComponent<D extends Token<R> | Constructable<R>, R extends Partial<T>>(
    identifier: D,
  ): FC<{ [P in keyof T as P extends keyof R ? never : P]: T[P] }>;

  function makeComponent<D extends Token<any> | Constructable<any>, R extends Partial<T>>(
    identifier: D,
    map: (service: D extends Token<infer U> ? U : D extends Constructable<infer K> ? K : never) => R,
  ): FC<{ [P in keyof T as P extends keyof R ? never : P]: T[P] }>;

  function makeComponent<
    D extends { [P in keyof T as T[P] extends object ? P : never]?: Token<T[P]> | Constructable<T[P]> },
  >(identifiers: D): FC<{ [P in keyof T as P extends keyof D ? never : P]: T[P] }>;

  function makeComponent<D extends Record<string, Token<any> | Constructable<any>>, R extends Partial<T>>(
    identifiers: D,
    map: (services: {
      [P in keyof D]: D[P] extends Token<infer U> ? U : D[P] extends Constructable<infer K> ? K : never;
    }) => R,
  ): FC<{ [P in keyof T as P extends keyof R ? never : P]: T[P] }>;

  function makeComponent(identifiers: object | Token<any> | Constructable<any>, map?: Function): any {
    if (typeof identifiers === 'function' || identifiers instanceof Token) {
      const service = Container.get(identifiers as any);

      if (map) {
        return (rest: JSX.IntrinsicAttributes & T) => <Component {...rest} {...(map(service) as any)} />;
      }

      return (rest: JSX.IntrinsicAttributes & T) => <Component {...rest} {...(service as any)} />;
    }

    const services = Object.entries(identifiers).reduce(
      (acc, [key, identifier]) => ({
        ...acc,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [key]: Container.get(identifier as any),
      }),
      {},
    );

    if (map) {
      return (rest: JSX.IntrinsicAttributes & T) => <Component {...rest} {...(map(services) as any)} />;
    }

    return (rest: JSX.IntrinsicAttributes & T) => <Component {...rest} {...services} />;
  }

  return makeComponent;
};
