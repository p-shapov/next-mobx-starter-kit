import { type IObservableValue, observable } from 'mobx';
import { useMemo } from 'react';

function useObservableBox<T>(): IObservableValue<T | undefined>;
function useObservableBox<T>(x: T): IObservableValue<T>;
function useObservableBox<T>(x?: T): IObservableValue<T | undefined> {
  return useMemo(() => observable.box(x), [x]);
}

export { useObservableBox };
