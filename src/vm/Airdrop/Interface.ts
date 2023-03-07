import type { Address } from '@wagmi/core';

import type { SalePhase } from 'lib/types/common';

import type { Datapoint } from 'service/Datapoint';

export interface IAirdrop {
  phase: Datapoint<SalePhase>;
  allowedToMint: Datapoint<number | undefined, [Address | undefined]>;
}
