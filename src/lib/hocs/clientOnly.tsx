import { createContext, FC, ReactNode, useContext, useEffect, useState } from 'react';

import { isServer } from 'lib/utils';

const MountedContext = createContext({ mounted: false });

export const MountedProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return <MountedContext.Provider value={{ mounted }}>{children}</MountedContext.Provider>;
};

export const clientOnly = <T extends object>(Component: FC<T>, Fallback?: FC): FC<T> => {
  return (props: T) => {
    const { mounted } = useContext(MountedContext);

    if (!mounted || isServer) return Fallback ? <Fallback /> : null;

    return <Component {...props} />;
  };
};
