import FiatType from '../types/fiat.type';
export class FiatPrice implements FiatType {
  constructor(
    public code: string,
    public currency: string,
    public price: number,
    public price_usd: number,
    public source: string,
    public date: string,
  ) { }
}
