import { Inject, Service } from 'typedi';

import * as SalePhaseDP from 'dp/SalePhaseDP';
import * as SalePriceDP from 'dp/SalePriceDP';
import * as SaleSupplyDP from 'dp/SaleSupplyDP';
import * as SaleMintDP from 'dp/SaleMintDP';

import { SaleVM } from './SaleVM';
import { IoCTypes } from './IoCTypes';

@Service(IoCTypes.IPublicSaleVM)
export class PublicSaleVM extends SaleVM {
  constructor(
    @Inject(SaleMintDP.IoCTypes.IPublicSaleMintDP) public mint: SaleMintDP.ISaleMintDP,
    @Inject(SalePhaseDP.IoCTypes.IPublicSalePhaseDP) public phase: SalePhaseDP.ISalePhaseDP,
    @Inject(SalePriceDP.IoCTypes.IPublicSalePriceDP) public price: SalePriceDP.ISalePriceDP,
    @Inject(SaleSupplyDP.IoCTypes.IPublicSaleSupplyDP) public supply: SalePriceDP.ISalePriceDP,
  ) {
    super();

    this.phase.injectDeps(() => [this.amount.value]);
    this.mint.injectDeps(() => [this.amount.value]);
  }
}
