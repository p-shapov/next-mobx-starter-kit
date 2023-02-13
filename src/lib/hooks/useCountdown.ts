import { action, runInAction } from 'mobx';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { useInterval } from 'lib/hooks';
import { getRestTime } from 'lib/utils';

export const useCountdown = <T = number>(
  starts: number,
  ms: number,
  parse: (x: number) => T = (x) => x as T,
) => {
  const restTime = useMemo(() => getRestTime(starts, ms), [starts, ms]);
  const [countdown, setCountdown] = useState(restTime);

  const stepCountdown = useCallback(
    () =>
      runInAction(() => {
        if (document.visibilityState === 'visible') setCountdown((prev) => prev - 1000);
      }),
    [],
  );

  useInterval(stepCountdown, 1000);

  useEffect(() => {
    const handleUpdateCountdown = action(() => {
      if (document.visibilityState === 'visible') setCountdown(restTime);
    });

    window.addEventListener('visibilitychange', handleUpdateCountdown);

    return () => {
      window.removeEventListener('visibilitychange', handleUpdateCountdown);
    };
  }, [, restTime]);

  return parse(countdown);
};
