import { createContext, FC, ReactNode, useContext, useEffect, useId, useState } from 'react';

const DisableWindowScrollContext = createContext<{
  stackDepth: number;
  push: (id: string) => void;
  pop: (id: string) => void;
} | null>(null);

export const DisableWindowScrollProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [stack, setStack] = useState<Array<string>>([]);

  const push = (id: string) => {
    setStack((arr) => [id, ...arr]);
  };

  const pop = (id: string) => {
    setStack((arr) => arr.filter((x) => x !== id));
  };

  return (
    <DisableWindowScrollContext.Provider
      value={{
        stackDepth: stack.length,
        push,
        pop,
      }}
    >
      {children}
    </DisableWindowScrollContext.Provider>
  );
};

export const useDisableWindowScroll = (disabled: boolean) => {
  const context = useContext(DisableWindowScrollContext);
  const id = useId();

  if (!context) throw new Error('Should be used inside DisableWidowScrollProvider');

  const { stackDepth, push, pop } = context;

  useEffect(() => {
    if (disabled) {
      push(id);
    } else {
      pop(id);
    }

    return () => {
      pop(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disabled]);

  useEffect(() => {
    const body = document.body;

    if (stackDepth === 0) {
      body.style.overflow = '';
      body.style.paddingRight = '';
    } else {
      const rootEl = document.getElementById('__next');

      const wWidth = window.innerWidth;
      const rWidth = rootEl?.offsetWidth || window.innerWidth;

      const scrollBarWidth = wWidth - rWidth;

      body.style.overflow = 'hidden';
      body.style.paddingRight = `${scrollBarWidth}px`;
    }

    return () => {
      if (stackDepth === 0) {
        body.style.overflow = '';
        body.style.paddingRight = '';
      }
    };
  }, [stackDepth]);
};
