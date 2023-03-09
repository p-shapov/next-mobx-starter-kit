/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
import { type Constructable, Token, Container } from 'typedi';

import { AbstractFactory } from 'lib/types/AbstractFactory';

import { type Datapoint, mkDatapoint } from '../Datapoint';
import type { DatapointParameters } from '../types';

const instanceCache = new Map<Token<unknown>, Datapoint<any, any>>();

function InjectDatapointFactory<T, D extends Array<unknown>>(
  params: Omit<DatapointParameters<T, D>, '$deps'>,
): Function;
function InjectDatapointFactory<T, D extends Array<unknown>>(
  token: Token<Datapoint<T, D>> | Omit<DatapointParameters<T, D>, '$deps'> | undefined,
  params: Omit<DatapointParameters<T, D>, '$deps'>,
): Function;
function InjectDatapointFactory<T, D extends Array<unknown>>(
  tokenOrParams: Token<any> | Omit<DatapointParameters<T, D>, '$deps'> | undefined,
  params?: Omit<DatapointParameters<T, D>, '$deps'>,
): Function {
  return (object: Constructable<unknown>, propertyName: string, index?: number) => {
    Container.registerHandler({
      object,
      propertyName,
      index,
      value: (container) => {
        class DatapointFactory extends AbstractFactory<[$deps: () => D], Datapoint<T, D>> {
          create($deps: () => D) {
            if (params && tokenOrParams instanceof Token) {
              const cachedInstance = instanceCache.get(tokenOrParams);

              if (cachedInstance) return cachedInstance;

              const instance = mkDatapoint({ ...params, $deps } as DatapointParameters<T, D>);
              instanceCache.set(tokenOrParams, instance);

              return instance;
            }

            return mkDatapoint({
              ...tokenOrParams,
              $deps,
            } as DatapointParameters<T, D>);
          }
        }

        let instance: DatapointFactory;

        if (tokenOrParams instanceof Token && container.has(tokenOrParams)) {
          instance = container.get(tokenOrParams);
        } else {
          instance = new DatapointFactory();

          if (tokenOrParams instanceof Token) Container.set(tokenOrParams, instance);
        }

        return instance;
      },
    });
  };
}

export { InjectDatapointFactory };
