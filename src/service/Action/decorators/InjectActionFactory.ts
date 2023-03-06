/* eslint-disable @typescript-eslint/ban-types */
import { type Constructable, Token, Container } from 'typedi';

import { AbstractFactory } from 'lib/types/AbstractFactory';

import { type Action, mkAction } from '../Action';
import type { ActionParameters } from '../types';

const instanceCache = new Map<
  Token<unknown>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Action<any, any, any>
>();

function InjectActionFactory<T, D extends Array<unknown>, I extends boolean = false>(
  params: ActionParameters<T, D, I>,
): Function;
function InjectActionFactory<T, D extends Array<unknown>, I extends boolean = false>(
  token: Token<AbstractFactory<D, Action<T, D, I>>> | undefined,
  params: ActionParameters<T, D, I>,
): Function;
function InjectActionFactory<T, D extends Array<unknown>, I extends boolean = false>(
  tokenOrParams: Token<AbstractFactory<D, Action<T, D, I>>> | ActionParameters<T, D, I> | undefined,
  params?: ActionParameters<T, D, I>,
): Function {
  return (object: Constructable<unknown>, propertyName: string, index?: number) => {
    Container.registerHandler({
      object,
      propertyName,
      index,
      value: (container) => {
        class ActionFactory extends AbstractFactory<D, Action<T, D, I>> {
          create(...deps: D) {
            if (params && tokenOrParams instanceof Token) {
              const cachedInstance = instanceCache.get(tokenOrParams);

              if (cachedInstance) return cachedInstance;

              const instance = mkAction<T, D, I>({ ...params, deps });
              instanceCache.set(tokenOrParams, instance);

              return instance;
            }
            if (params) return mkAction<T, D, I>({ ...params, deps });

            return mkAction<T, D, I>({ ...(tokenOrParams as ActionParameters<T, D, I>), deps });
          }
        }

        let instance: AbstractFactory<D, Action<T, D, I>>;

        if (tokenOrParams instanceof Token && container.has(tokenOrParams)) {
          instance = container.get(tokenOrParams);
        } else {
          instance = new ActionFactory();

          if (tokenOrParams instanceof Token) Container.set(tokenOrParams, instance);
        }

        return instance;
      },
    });
  };
}

export { InjectActionFactory };
