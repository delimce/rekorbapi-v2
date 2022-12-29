import { FiatPrice } from '../dto/fiatPrice';

export interface PriceServiceInterface {
  getPrice(): Promise<number>;
  // getFiatPrice(): Promise<FiatPrice>;
}

export const priceService = Symbol('PriceServiceInterface');
export const bcvPriceService = Symbol('BcvPriceServiceInterface');
export const monitorPriceService = Symbol('MonitorPriceServiceInterface');
