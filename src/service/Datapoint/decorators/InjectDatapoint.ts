import { type Constructable, type Token, Container } from 'typedi';

import { type Datapoint, type DatapointParameters, mkDatapoint } from '../Datapoint';

export function InjectDatapoint<T>({
  token,
  ...params
}: DatapointParameters<T> & {
  token?: Token<Datapoint<T>>;
}) {
  return (object: Constructable<unknown>, propertyName: string, index?: number) => {
    Container.registerHandler({
      object,
      propertyName,
      index,
      value: (container) => {
        if (token) {
          let instance: Datapoint<T>;

          if (container.has(token)) {
            instance = container.get(token);
          } else {
            instance = mkDatapoint(params);

            if (token) Container.set(token, instance);
          }

          return instance;
        }

        return mkDatapoint(params);
      },
    });
  };
}
