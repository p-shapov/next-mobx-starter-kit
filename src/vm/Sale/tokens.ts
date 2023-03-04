import { Token } from 'typedi';

import type { SalePhase } from 'lib/types/common';
import type { AbstractFactory } from 'lib/types/AbstractFactory';

import type { Action } from 'service/Action';
import type { Datapoint } from 'service/Datapoint';

export const tokens = {
  mint: new Token<AbstractFactory<[() => [number]], Action<void, [number]>>>(),
  phase: new Token<Datapoint<SalePhase>>(),
  price: new Token<Datapoint<number>>(),
  supply: new Token<Datapoint<number>>(),
};
