import { Token } from 'typedi';

import { ISalePhaseDP } from './Interface';

export const IoCTypes = {
  IPrivateSalePhaseDP: new Token<ISalePhaseDP>('IPrivateSalePhaseDP'),
  IPublicSalePhaseDP: new Token<ISalePhaseDP>('IPublicSalePhaseDP'),
};
