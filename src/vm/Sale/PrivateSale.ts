import { Service } from 'typedi';

import { PrivateSaleMint } from 'action/SaleMint';

import { PrivateSalePhase } from 'datapoint/SalePhase';
import { PrivateSalePrice } from 'datapoint/SalePrice';
import { PrivateSaleSupply } from 'datapoint/SaleSupply';

import { Sale } from './Sale';
import { IoCSale } from './IoCTypes';

@Service(IoCSale.IPrivateSale)
export class PrivateSale extends Sale {
  mint = new PrivateSaleMint(() => [this.amount.value]);

  phase = new PrivateSalePhase();
  price = new PrivateSalePrice();
  supply = new PrivateSaleSupply();
  totalPrice = this.price.map((val) => val * this.amount.value);

  constructor() {
    super();
  }
}
