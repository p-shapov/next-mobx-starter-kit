import { fetchData } from 'shared/utils/fetchData';

import { IPublicSaleModel } from './Interface';

export class PublicSaleModelMock implements IPublicSaleModel {
  price = fetchData<number, null>(null);
  supply = fetchData<number, null>(null);
  phase = fetchData<'Soon' | 'Started' | 'Finished', null>(null);

  async mint(count: number) {
    // eslint-disable-next-line no-console
    console.log(count);
  }
}
