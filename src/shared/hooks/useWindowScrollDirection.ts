import { useEffect, useRef, useState } from 'react';

export const useWindowScrollDirection = () => {
  const prevScrollRef = useRef(0);
  const [direction, setDirection] = useState<'up' | 'down'>();

  useEffect(() => {
    const updateDirection = () => {
      const { scrollY: cScrollY } = window;

      const { current: prevScrollY } = prevScrollRef;

      if (cScrollY > prevScrollY) setDirection('down');
      if (cScrollY < prevScrollY) setDirection('up');

      prevScrollRef.current = cScrollY;
    };

    window.addEventListener('scroll', updateDirection);

    return () => {
      window.removeEventListener('scroll', updateDirection);
    };
  }, []);

  return direction;
};
