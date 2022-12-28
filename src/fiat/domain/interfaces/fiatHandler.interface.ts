import { FiatPrice } from '../dto/fiatPrice';

export interface FiatHandler {
  getFiatPrices(): Promise<FiatPrice[]>;
  // getFiatByCode(code: string): Promise<FiatPrice>;
}
