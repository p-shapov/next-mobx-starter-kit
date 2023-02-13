import { runInAction } from 'mobx';
import { useLocalObservable } from 'mobx-react-lite';
import { createContext, FC, ReactNode, useContext, useEffect, useId } from 'react';

const DisableWindowScrollContext = createContext<{
  stack: Array<string>;
  stackDepth: number;
  push: (id: string) => void;
  pop: (id: string) => void;
} | null>(null);

export const DisableWindowScrollProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const store = useLocalObservable(() => ({
    stack: [] as Array<string>,
    get stackDepth(): number {
      return store.stack.length;
    },
    push(id: string) {
      runInAction(() => {
        store.stack.push(id);
      });
    },
    pop(id: string) {
      runInAction(() => {
        store.stack = store.stack.filter((x) => x !== id);
      });
    },
  }));

  return <DisableWindowScrollContext.Provider value={store}>{children}</DisableWindowScrollContext.Provider>;
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
