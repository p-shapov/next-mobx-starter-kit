import { useCallback, useEffect, useMemo, useState } from 'react';

import { useInterval } from 'shared/hooks/useInterval';
import { getRestTime } from 'shared/utils/getRestTime';

export const useCountdown = <T = number>(
  starts: number,
  ms: number,
  parse: (x: number) => T = (x) => x as T,
) => {
  const restTime = useMemo(() => getRestTime(starts, ms), [starts, ms]);

  const [countdown, setCountdown] = useState(restTime);

  const stepPrestakeCountdown = useCallback(() => {
    if (document.visibilityState === 'visible') setCountdown((prev) => prev - 1000);
  }, []);

  useInterval(stepPrestakeCountdown, 1000);

  useEffect(() => {
    const updateCountdown = () => {
      setCountdown(restTime);
    };

    const handleUpdateCountdown = () => {
      if (document.visibilityState === 'visible') updateCountdown();
    };

    updateCountdown();

    window.addEventListener('visibilitychange', handleUpdateCountdown);

    return () => {
      window.removeEventListener('visibilitychange', handleUpdateCountdown);
    };
  }, [restTime]);

  return parse(countdown);
};
