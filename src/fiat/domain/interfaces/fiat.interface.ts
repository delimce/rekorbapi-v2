export interface FiatInterface {
  code: string;
  currency: string;
  price: number;
  price_usd: number;
  source: string;
}

export default FiatInterface;
