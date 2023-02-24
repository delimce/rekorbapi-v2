export interface CryptoInterface {
  id: string;
  name: string;
  symbol: string;
  price_usd: number;
  slug?: string;
  num_market_pairs?: number;
  date_added?: string;
  tags?: string[];
  max_supply?: number;
  circulating_supply?: number;
  total_supply?: number;
  platform: string;
  rank?: number;
  last_updated?: string;
}

export default CryptoInterface;
