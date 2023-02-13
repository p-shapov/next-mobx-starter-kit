import { makeObservable } from 'mobx';
import { Inject, Service } from 'typedi';

import * as SalePhaseDP from 'dp/SalePhaseDP';
import * as SalePriceDP from 'dp/SalePriceDP';
import * as SaleSupplyDP from 'dp/SaleSupplyDP';
import * as SaleMintDP from 'dp/SaleMintDP';

import { SaleVM } from './SaleVM';
import { IoCTypes } from './IoCTypes';

@Service(IoCTypes.IPrivateSaleVM)
export class PrivateSaleVM extends SaleVM {
  constructor(
    @Inject(SaleMintDP.IoCTypes.IPrivateSaleMintDP) public mint: SaleMintDP.ISaleMintDP,
    @Inject(SalePhaseDP.IoCTypes.IPrivateSalePhaseDP) public phase: SalePhaseDP.ISalePhaseDP,
    @Inject(SalePriceDP.IoCTypes.IPrivateSalePriceDP) public price: SalePriceDP.ISalePriceDP,
    @Inject(SaleSupplyDP.IoCTypes.IPrivateSaleSupplyDP) public supply: SalePriceDP.ISalePriceDP,
  ) {
    super();
    makeObservable(this);

    this.phase.injectDeps(() => [this.amount.value]);
    this.mint.injectDeps(() => [this.amount.value]);
  }
}
