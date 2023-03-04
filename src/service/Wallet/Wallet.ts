import { Service } from 'typedi';

import { fetchData } from 'lib/utils';

import { IWallet } from './Interface';

@Service()
export class Wallet implements IWallet {
  address = fetchData<string>('0x378385D7911C40Db5E381BAfF1E50a4A7f1F3D7c');
  connect() {
    // eslint-disable-next-line no-console
    console.log('open connect modal');
  }
  disconnect() {
    // eslint-disable-next-line no-console
    console.log('disconnect');
  }
}
