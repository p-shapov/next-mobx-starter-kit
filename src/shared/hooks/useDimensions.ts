import { useEffect, useRef, useState } from 'react';

export const useDimensions = <T extends HTMLElement>() => {
  const ref = useRef<T | null>(null);
  const [width, setWidth] = useState<number>();
  const [height, setHeight] = useState<number>();

  useEffect(() => {
    const { current: element } = ref;

    if (element) {
      setWidth(element.offsetWidth);
      setHeight(element.offsetHeight);
    }
  }, []);

  return [ref, width, height] as const;
};
