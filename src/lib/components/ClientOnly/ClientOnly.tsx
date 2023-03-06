import { FC, ReactNode } from 'react';

import { useIsSsr } from 'lib/hooks';

type ClientOnlyProps = {
  children: ReactNode;
  fallback?: ReactNode;
};

const ClientOnly: FC<ClientOnlyProps> = ({ children, fallback = null }) => {
  const isSsr = useIsSsr();

  return <>{!isSsr ? children : fallback}</>;
};

export { ClientOnly };
