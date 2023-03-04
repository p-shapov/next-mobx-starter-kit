import { type Constructable, type Token, Container } from 'typedi';

import { AbstractFactory } from 'lib/types/AbstractFactory';

import { type Action, type ActionParameters, mkAction } from '../Action';

export function InjectActionFactory<T, D extends Array<unknown>>({
  token,
  ...params
}: Omit<ActionParameters<T, D>, 'getDeps'> & {
  token?: Token<AbstractFactory<[() => D], Action<T, D>>>;
}) {
  return (object: Constructable<unknown>, propertyName: string, index?: number) => {
    Container.registerHandler({
      object,
      propertyName,
      index,
      value: (container) => {
        class ActionFactory extends AbstractFactory<[() => D], Action<T, D>> {
          create(getDeps: () => D) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            return mkAction<T, D>({ ...params, getDeps });
          }
        }

        let instance: AbstractFactory<[() => D], Action<T, D>>;

        if (token && container.has(token)) {
          instance = container.get(token);
        } else {
          instance = new ActionFactory();

          if (token) Container.set(token, instance);
        }

        return instance;
      },
    });
  };
}
