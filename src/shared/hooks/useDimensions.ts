import { useEffect, useRef } from 'react';

import { useObservableBox } from './useObservableBox';

export const useDimensions = <T extends HTMLElement>() => {
  const ref = useRef<T | null>(null);
  const width$ = useObservableBox<number>();
  const height$ = useObservableBox<number>();

  useEffect(() => {
    const { current: element } = ref;

    if (element) {
      width$.set(element.offsetWidth);
      height$.set(element.offsetHeight);
    }
  }, [height$, width$]);

  return [ref, () => width$.get(), () => height$.get()] as const;
};
