import { runInAction } from 'mobx';
import { useEffect, useState } from 'react';

export const useWindowScrollPosition = () => {
  const [position, setPosition] = useState(0);

  useEffect(() => {
    const updatePosition = () => {
      runInAction(() => {
        setPosition(window.scrollY);
      });
    };

    updatePosition();

    window.addEventListener('scroll', updatePosition);

    return () => {
      window.removeEventListener('scroll', updatePosition);
    };
  }, [position]);

  return position;
};
