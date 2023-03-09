/* eslint-disable @typescript-eslint/ban-types */
import { type Constructable, Token, Container } from 'typedi';

import { type Datapoint, mkDatapoint } from '../Datapoint';
import type { DatapointParameters } from '../types';

function InjectDatapoint<T, D extends Array<unknown>>(params: DatapointParameters<T, D>): Function;
function InjectDatapoint<T, D extends Array<unknown>>(
  token: Token<Datapoint<T, D>> | undefined,
  params: DatapointParameters<T, D>,
): Function;
function InjectDatapoint<T, D extends Array<unknown>>(
  tokenOrParams: Token<Datapoint<T, D>> | DatapointParameters<T, D> | undefined,
  params?: DatapointParameters<T, D>,
): Function {
  return (object: Constructable<unknown>, propertyName: string, index?: number) => {
    Container.registerHandler({
      object,
      propertyName,
      index,
      value: (container) => {
        if (params) {
          let instance: Datapoint<T, D>;

          if (tokenOrParams instanceof Token && container.has(tokenOrParams)) {
            instance = container.get(tokenOrParams);
          } else {
            instance = mkDatapoint(params);

            if (tokenOrParams instanceof Token) Container.set(tokenOrParams, instance);
          }

          return instance;
        }

        return mkDatapoint(tokenOrParams as DatapointParameters<T, D>);
      },
    });
  };
}

export { InjectDatapoint };
