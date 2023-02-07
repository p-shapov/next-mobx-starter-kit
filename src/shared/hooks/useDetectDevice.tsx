import { createContext, FC, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import UAParser from 'ua-parser-js';

import screens from 'shared/styles/screens.module.scss';

type DetectDeviceValue = {
  isMobile?: boolean;
  isDesktop?: boolean;
  isMobileRender?: boolean;
  isDesktopRender?: boolean;
};

export const DetectDeviceContext = createContext<null | DetectDeviceValue>(null);

export const DetectDeviceProvider: FC<{ uaString?: string; children: ReactNode }> = ({
  uaString,
  children,
}) => {
  const uaParser = useMemo(() => (uaString ? new UAParser(uaString) : undefined), [uaString]);

  const deviceType = useMemo(() => uaParser?.getDevice().type, [uaParser]);

  const defaultIsMobile = deviceType === 'mobile';

  const [isMobile, setIsMobile] = useState(deviceType ? defaultIsMobile : undefined);
  const [isDesktop, setIsDesktop] = useState(deviceType ? !defaultIsMobile : undefined);

  useEffect(() => {
    const detectDevice = () => {
      const matchesScreenSM = window.matchMedia(`(max-width: calc(${screens.screenSM} - 1px))`).matches;
      const isMobile = matchesScreenSM;
      const isDesktop = !matchesScreenSM;

      setIsMobile(isMobile);
      setIsDesktop(isDesktop);
    };

    detectDevice();

    window.addEventListener('resize', detectDevice);

    return () => {
      window.removeEventListener('resize', detectDevice);
    };
  }, []);

  return (
    <DetectDeviceContext.Provider
      value={{
        isMobile,
        isDesktop,
        isMobileRender: isMobile || typeof isMobile === 'undefined',
        isDesktopRender: isDesktop || typeof isDesktop === 'undefined',
      }}
    >
      {children}
    </DetectDeviceContext.Provider>
  );
};

export const useDetectDevice = () => {
  const context = useContext(DetectDeviceContext);

  if (!context) throw new Error('Should be used inside DetectDeviceProvider');

  return context;
};
