import { Token } from 'typedi';

import { ISalePriceDP } from './Interface';

export const IoCTypes = {
  IPrivateSalePriceDP: new Token<ISalePriceDP>('IPrivateSalePriceDP'),
  IPublicSalePriceDP: new Token<ISalePriceDP>('IPublicSalePriceDP'),
};
