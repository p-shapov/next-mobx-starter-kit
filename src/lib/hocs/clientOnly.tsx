import { createContext, FC, ReactNode, useContext } from 'react';

import { isServer } from 'lib/utils';
import { useMounted } from 'lib/hooks';

const MountedContext = createContext({ mounted: false });

export const MountedProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const mounted = useMounted();

  return <MountedContext.Provider value={{ mounted }}>{children}</MountedContext.Provider>;
};

export const clientOnly = <T extends object>(Component: FC<T>): FC<T> => {
  return (props: T) => {
    const { mounted } = useContext(MountedContext);

    if (!mounted || isServer) return null;

    return <Component {...props} />;
  };
};
