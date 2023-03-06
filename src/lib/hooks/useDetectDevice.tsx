import { createContext, FC, ReactNode, useContext, useEffect, useMemo } from 'react';
import UAParser from 'ua-parser-js';
import { runInAction } from 'mobx';
import { useLocalObservable } from 'mobx-react-lite';

import screens from 'assets/styles/screens.module.scss';

type DetectDeviceValue = {
  isMobile?: boolean;
  isDesktop?: boolean;
};

export const DetectDeviceContext = createContext<null | DetectDeviceValue>(null);

export const DetectDeviceProvider: FC<{ uaString?: string; children: ReactNode }> = ({
  uaString,
  children,
}) => {
  const uaParser = useMemo(() => (uaString ? new UAParser(uaString) : undefined), [uaString]);
  const { type, os } = useMemo(
    () => ({ type: uaParser?.getDevice().type, os: uaParser?.getOS().name }),
    [uaParser],
  );
  const defaultIsMobile = type === 'mobile';

  const store = useLocalObservable(() => ({
    isMobile: type ? defaultIsMobile : undefined,
    isDesktop: type || os === 'Windows' ? !defaultIsMobile : undefined,
  }));

  useEffect(() => {
    const detectDevice = () => {
      const matchesScreenSM = window.matchMedia(`(max-width: calc(${screens.screenSM} - 1px))`).matches;
      const isMobile = matchesScreenSM;
      const isDesktop = !matchesScreenSM;

      runInAction(() => {
        store.isMobile = isMobile;
        store.isDesktop = isDesktop;
      });
    };

    if (!store.isDesktop || !store.isMobile) detectDevice();

    window.addEventListener('resize', detectDevice);

    return () => {
      window.removeEventListener('resize', detectDevice);
    };
  }, [store]);

  return <DetectDeviceContext.Provider value={store}>{children}</DetectDeviceContext.Provider>;
};

export const useDetectDevice = () => {
  const context = useContext(DetectDeviceContext);

  if (!context) throw new Error('Should be used inside DetectDeviceProvider');

  return context;
};
