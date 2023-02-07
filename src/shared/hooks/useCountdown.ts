import { action, computed, runInAction } from 'mobx';
import { useCallback, useEffect, useMemo } from 'react';

import { useInterval } from 'shared/hooks/useInterval';
import { getRestTime } from 'shared/utils/getRestTime';

import { useObservableBox } from './useObservableBox';

export const useCountdown = <T = number>(
  starts: number,
  ms: number,
  parse: (x: number) => T = (x) => x as T,
) => {
  const restTime = useMemo(() => getRestTime(starts, ms), [starts, ms]);
  const countdown$ = useObservableBox(restTime);

  const stepCountdown = useCallback(
    () =>
      runInAction(() => {
        if (document.visibilityState === 'visible') countdown$.set(countdown$.get() - 1000);
      }),
    [countdown$],
  );

  useInterval(stepCountdown, 1000);

  useEffect(() => {
    const handleUpdateCountdown = action(() => {
      if (document.visibilityState === 'visible') countdown$.set(restTime);
    });

    window.addEventListener('visibilitychange', handleUpdateCountdown);

    return () => {
      window.removeEventListener('visibilitychange', handleUpdateCountdown);
    };
  }, [countdown$, restTime]);

  return () => computed(() => parse(countdown$.get())).get();
};
