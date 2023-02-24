import { Token } from 'typedi';

export const IoCSale = {
  IPublicSale: new Token('IPrivateSale'),
  IPrivateSale: new Token('IPrivateSale'),
};
