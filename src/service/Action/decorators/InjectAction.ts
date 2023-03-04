import { type Constructable, type Token, Container } from 'typedi';

import { type Action, type ActionParameters, mkAction } from '../Action';

export function InjectAction<T>({
  token,
  ...params
}: ActionParameters<T> & {
  token?: Token<Action<T>>;
}) {
  return (object: Constructable<unknown>, propertyName: string, index?: number) => {
    Container.registerHandler({
      object,
      propertyName,
      index,
      value: (container) => {
        if (token) {
          let instance: Action<T>;

          if (container.has(token)) {
            instance = container.get(token);
          } else {
            instance = mkAction(params);

            if (token) Container.set(token, instance);
          }

          return instance;
        }

        return mkAction(params);
      },
    });
  };
}
