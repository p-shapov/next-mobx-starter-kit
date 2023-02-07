import { runInAction } from 'mobx';
import { useEffect, useRef } from 'react';

import { useObservableBox } from './useObservableBox';

export const useWindowScrollDirection = () => {
  const prevScrollRef = useRef(0);
  const direction$ = useObservableBox<'up' | 'down'>();

  useEffect(() => {
    const updateDirection = () => {
      const { scrollY: cScrollY } = window;

      const { current: prevScrollY } = prevScrollRef;

      runInAction(() => {
        if (cScrollY > prevScrollY) direction$.set('down');
        if (cScrollY < prevScrollY) direction$.set('up');
      });

      prevScrollRef.current = cScrollY;
    };

    window.addEventListener('scroll', updateDirection);

    return () => {
      window.removeEventListener('scroll', updateDirection);
    };
  }, [direction$]);

  return () => direction$.get();
};
