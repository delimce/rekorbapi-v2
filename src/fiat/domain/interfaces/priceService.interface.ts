import { FiatPrice } from '../dto/fiatPrice';

export interface PriceServiceInterface {
  getPrice(): number;
  // getFiatPrice(): Promise<FiatPrice>;
}

export const priceService = Symbol('PriceServiceInterface');
