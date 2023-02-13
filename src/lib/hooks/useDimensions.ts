import { MutableRefObject, useEffect, useRef, useState } from 'react';

export const useDimensions = <T extends HTMLElement>(): [
  ref: MutableRefObject<T | null>,
  width?: number,
  height?: number,
] => {
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

  return [ref, width, height];
};
