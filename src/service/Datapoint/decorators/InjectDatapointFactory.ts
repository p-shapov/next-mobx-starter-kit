import { type Constructable, type Token, Container } from 'typedi';

import { AbstractFactory } from 'lib/types/AbstractFactory';

import { type Datapoint, type DatapointParameters, mkDatapoint } from '../Datapoint';

export function InjectDatapointFactory<T, D extends Array<unknown>>({
  token,
  ...params
}: Omit<DatapointParameters<T, D>, '$deps'> & {
  token?: Token<AbstractFactory<[() => D], Datapoint<T, D>>>;
}) {
  return (object: Constructable<unknown>, propertyName: string, index?: number) => {
    Container.registerHandler({
      object,
      propertyName,
      index,
      value: (container) => {
        class DatapointFactory extends AbstractFactory<[() => D], Datapoint<T, D>> {
          create($deps: () => D) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return mkDatapoint<T, D>({ ...params, $deps } as any);
          }
        }

        let instance: AbstractFactory<[() => D], Datapoint<T, D>>;

        if (token && container.has(token)) {
          instance = container.get(token);
        } else {
          instance = new DatapointFactory();

          if (token) Container.set(token, instance);
        }

        return instance;
      },
    });
  };
}
