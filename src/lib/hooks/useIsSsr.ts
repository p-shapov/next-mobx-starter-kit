import { useEffect, useState } from 'react';

export const useIsSsr = () => {
  const [isSsr, setIsSsr] = useState(true);

  useEffect(() => {
    setIsSsr(false);
  }, []);

  return isSsr;
};
