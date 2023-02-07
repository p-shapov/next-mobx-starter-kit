import { runInAction } from 'mobx';
import { useEffect } from 'react';

import { useObservableBox } from './useObservableBox';

export const useWindowScrollPosition = () => {
  const position$ = useObservableBox(0);

  useEffect(() => {
    const updatePosition = () => {
      runInAction(() => {
        position$.set(window.scrollY);
      });
    };

    updatePosition();

    window.addEventListener('scroll', updatePosition);

    return () => {
      window.removeEventListener('scroll', updatePosition);
    };
  }, [position$]);

  return () => position$.get();
};
