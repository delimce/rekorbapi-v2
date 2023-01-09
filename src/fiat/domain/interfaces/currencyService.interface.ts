import { FiatPrice } from '../dto/fiatPrice';

/**
 * this interface is used to get the price of a currency on USD base price
 */
export interface CurrencyServiceInterface {
  toFiatPrice(data: any): FiatPrice;
  getByCurrency(currency: string): Promise<FiatPrice | null>;
  getAll(): Promise<FiatPrice[]>;
}

export const currencyService = Symbol('CurrencyServiceInterface');
