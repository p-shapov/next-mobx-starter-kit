import { Token } from 'typedi';

import { ISaleSupplyDP } from './Interface';

export const IoCTypes = {
  IPrivateSaleSupplyDP: new Token<ISaleSupplyDP>('IPrivateSaleSupplyDP'),
  IPublicSaleSupplyDP: new Token<ISaleSupplyDP>('IPublicSaleSupplyDP'),
};
