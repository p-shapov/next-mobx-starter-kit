/* eslint-disable @typescript-eslint/ban-types */
import { type Constructable, Token, Container } from 'typedi';

import { AbstractFactory } from 'lib/types/AbstractFactory';

import { type Datapoint, mkDatapoint } from '../Datapoint';
import type { DatapointParameters } from '../types';

const instanceCache = new Map<
  Token<unknown>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Datapoint<any, any>
>();

function InjectDatapointFactory<T, D extends Array<unknown>>(params: DatapointParameters<T, D>): Function;
function InjectDatapointFactory<T, D extends Array<unknown>>(
  token: Token<AbstractFactory<[() => D], Datapoint<T, D>>> | DatapointParameters<T, D> | undefined,
  params: DatapointParameters<T, D>,
): Function;
function InjectDatapointFactory<T, D extends Array<unknown>>(
  tokenOrParams: Token<AbstractFactory<[() => D], Datapoint<T, D>>> | DatapointParameters<T, D> | undefined,
  params?: DatapointParameters<T, D>,
): Function {
  return (object: Constructable<unknown>, propertyName: string, index?: number) => {
    Container.registerHandler({
      object,
      propertyName,
      index,
      value: (container) => {
        class DatapointFactory extends AbstractFactory<[() => D], Datapoint<T, D>> {
          create($deps: () => D) {
            if (params && tokenOrParams instanceof Token) {
              const cachedInstance = instanceCache.get(tokenOrParams);

              if (cachedInstance) return cachedInstance;

              const instance = mkDatapoint<T, D>({ ...params, $deps });
              instanceCache.set(tokenOrParams, instance);

              return instance;
            }

            return mkDatapoint({ ...(tokenOrParams as DatapointParameters<T, D>), $deps });
          }
        }

        let instance: AbstractFactory<[() => D], Datapoint<T, D>>;

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
