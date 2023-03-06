/* eslint-disable @typescript-eslint/ban-types */
import { type Constructable, Token, Container } from 'typedi';

import { type Action, mkAction } from '../Action';
import type { ActionParameters } from '../types';

function InjectAction<T, D extends Array<unknown>, I extends boolean = false>(
  params: ActionParameters<T, D, I>,
): Function;
function InjectAction<T, D extends Array<unknown>, I extends boolean = false>(
  token: Token<Action<T, D, I>> | undefined,
  params: ActionParameters<T, D, I>,
): Function;
function InjectAction<T, D extends Array<unknown>, I extends boolean = false>(
  tokenOrParams: Token<Action<T, D, I>> | ActionParameters<T, D, I> | undefined,
  params?: ActionParameters<T, D, I>,
): Function {
  return (object: Constructable<unknown>, propertyName: string, index?: number) => {
    Container.registerHandler({
      object,
      propertyName,
      index,
      value: (containerInstance) => {
        if (params) {
          let instance: Action<T, D, I>;

          if (tokenOrParams instanceof Token && containerInstance.has(tokenOrParams)) {
            instance = containerInstance.get(tokenOrParams);
          } else {
            instance = mkAction(params);

            if (tokenOrParams instanceof Token) Container.set(tokenOrParams, instance);
          }

          return instance;
        }

        return mkAction(tokenOrParams as ActionParameters<T, D, I>);
      },
    });
  };
}

export { InjectAction };
