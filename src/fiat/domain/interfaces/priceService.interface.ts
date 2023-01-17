import { FiatPrice } from '../dto/fiatPrice';

export interface PriceServiceInterface {
  getPrice(): Promise<number>;
  getFiatPrice(): Promise<FiatPrice>;
}

export const monitorPriceService = Symbol('MonitorPriceServiceInterface');
export const bluePriceService = Symbol('BluePriceServiceInterface');
export const bcvPriceService = Symbol('BcvPriceServiceInterface');
export const priceService = Symbol('PriceServiceInterface');
