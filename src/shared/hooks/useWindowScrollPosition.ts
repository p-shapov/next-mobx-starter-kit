import { useEffect, useState } from 'react';

export const useWindowScrollPosition = () => {
  const [position, setPosition] = useState(0);

  useEffect(() => {
    const updatePosition = () => {
      setPosition(window.scrollY);
    };

    updatePosition();

    window.addEventListener('scroll', updatePosition);

    return () => {
      window.removeEventListener('scroll', updatePosition);
    };
  }, []);

  return position;
};
