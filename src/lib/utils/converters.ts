import { formatEther } from 'ethers/lib/utils.js';

import { SalePhase } from 'lib/types/common';

export const formatSalePhase = (phaseRaw: number): SalePhase => {
  if (phaseRaw !== 0 && phaseRaw !== 1 && phaseRaw !== 2)
    throw new Error('Contract violation: formatSalePhase');

  switch (phaseRaw) {
    case 0:
      return 'Soon';
    case 1:
      return 'Started';
    case 2:
      return 'Finished';
  }
};

export const formatBigint = (bigint: bigint) => Number(formatEther(bigint));
