import type { Status } from 'lib/types/common';

export const mergeStatuses = (a: Status, b: Status) => {
  if (a === b) return a;

  if (a === 'Loading' || b === 'Loading') return 'Loading';

  if (a === 'Error' || b === 'Error') return 'Error';

  return 'Idle';
};
