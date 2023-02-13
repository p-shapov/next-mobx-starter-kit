import { Token } from 'typedi';

import { ISaleMintDP } from './Interface';

export const IoCTypes = {
  IPrivateSaleMintDP: new Token<ISaleMintDP>('IPrivateSaleMintDP'),
  IPublicSaleMintDP: new Token<ISaleMintDP>('IPublicSaleMintDP'),
};
