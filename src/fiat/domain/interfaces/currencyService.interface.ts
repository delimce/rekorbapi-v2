import { FiatPrice } from '../dto/fiatPrice';

/**
 * this interface is used to get the price of a currency on USD base price
 */
export interface CurrencyServiceInterface {
  getByCurrency(currency: string): Promise<FiatPrice | null>;
  toFiatPrice(data: any): FiatPrice;
  getAll(): Promise<FiatPrice[]>;
}

export const currencyService = Symbol('CurrencyServiceInterface');
