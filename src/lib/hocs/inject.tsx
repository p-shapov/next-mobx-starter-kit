import { FC } from 'react';
import { type ServiceIdentifier, Container } from 'typedi';

export const inject =
  <T,>(Component: FC<T>) =>
  <K extends { [P in keyof T]?: ServiceIdentifier<T[P]> }>(identifiers: K) => {
    const props = Object.entries(identifiers).reduce(
      (acc, [key, identifier]) => ({
        ...acc,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [key]: Container.get(identifier as any),
      }),
      {} as T,
    );

    return (rest: { [P in keyof T as P extends keyof K ? never : P]: T[P] }) => {
      return (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        <Component {...rest} {...(props as any)} />
      );
    };
  };
