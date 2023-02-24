import { Service } from 'typedi';

import { PublicSaleMint } from 'action/SaleMint';

import { PublicSalePhase } from 'datapoint/SalePhase';
import { PublicSalePrice } from 'datapoint/SalePrice';
import { PublicSaleSupply } from 'datapoint/SaleSupply';

import { Sale } from './Sale';
import { IoCSale } from './IoCTypes';

@Service(IoCSale.IPublicSale)
export class PublicSale extends Sale {
  mint = new PublicSaleMint(() => [this.amount.value]);

  phase = new PublicSalePhase();
  price = new PublicSalePrice();
  supply = new PublicSaleSupply();
  totalPrice = this.price.map((val) => val * this.amount.value);

  constructor() {
    super();
  }
}
