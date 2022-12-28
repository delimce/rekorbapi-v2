import FiatInterface from '../interfaces/fiat.interface';

export class FiatPrice implements FiatInterface {
  constructor(
    public code: string,
    public currency: string,
    public price: number,
    public price_usd: number,
    public source: string,
  ) {}
}
