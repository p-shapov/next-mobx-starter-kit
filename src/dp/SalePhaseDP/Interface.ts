import { type GetDataPoint } from 'lib/mobx';
import { type SalePhase } from 'lib/types/common';

export type ISalePhaseDP = GetDataPoint<SalePhase, [unknown]>;
