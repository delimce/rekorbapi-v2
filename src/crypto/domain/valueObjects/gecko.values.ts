export interface GeckoMarketsConfig {
  vs_currency: string;
  ids: string;
  per_page: number;
  page: number;
  price_change_percentage: string;
}

export const geckoMarketsConfig: GeckoMarketsConfig = {
  vs_currency: 'usd',
  ids: '',
  per_page: 150,
  page: 1,
  price_change_percentage: '1h,24h,7d,14d,30d,200d,1y',
};

export interface GeckoGetCoinConfig {
  id: string;
  localization: boolean;
  tickers: boolean;
  market_data: boolean;
  community_data: boolean;
  developer_data: boolean;
  sparkline: boolean;
}

export const geckoGetCoinConfig: GeckoGetCoinConfig = {
  id: '',
  localization: false,
  tickers: false,
  market_data: true,
  community_data: false,
  developer_data: false,
  sparkline: false,
};
