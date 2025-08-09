import GeckoService from '@/crypto/infrastructure/services/gecko.service';
import { CoinGeckoClient } from 'coingecko-api-v3';
import { CryptoCoin } from '@/crypto/domain/dto/cryptoCoin';

jest.mock('coingecko-api-v3', () => {
  return {
    CoinGeckoClient: jest.fn().mockImplementation(() => ({
      ping: jest.fn(),
      coinMarket: jest.fn(),
      coinId: jest.fn(),
    })),
  };
});

const mockClient = () =>
  (CoinGeckoClient as unknown as jest.Mock).mock.results[0]
    .value as jest.Mocked<any>;

describe('GeckoService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('ping returns true when API says To the Moon', async () => {
    const service = new GeckoService();
    mockClient().ping.mockResolvedValue({ gecko_says: '(V3) To the Moon!' });
    await expect(service.ping()).resolves.toBe(true);
  });

  it('ping returns false otherwise', async () => {
    const service = new GeckoService();
    mockClient().ping.mockResolvedValue({ gecko_says: 'unknown' });
    await expect(service.ping()).resolves.toBe(false);
  });

  it('getCryptoList maps response to CryptoCoin', async () => {
    const service = new GeckoService();
    mockClient().coinMarket.mockResolvedValue([
      {
        id: 'bitcoin',
        name: 'Bitcoin',
        symbol: 'BTC',
        current_price: 10,
        market_cap_rank: 1,
        total_supply: 21,
        circulating_supply: 19,
      },
    ]);
    const list = await service.getCryptoList();
    expect(list).toHaveLength(1);
    expect(list[0]).toEqual(
      new CryptoCoin('bitcoin', 'Bitcoin', 'BTC', 10, 'gecko', 1, 21, 19),
    );
  });

  it('getCryptoById maps details or returns null on error', async () => {
    const service = new GeckoService();
    mockClient().coinId.mockResolvedValue({
      id: 'bitcoin',
      name: 'Bitcoin',
      symbol: 'BTC',
      coingecko_rank: 1,
      market_data: {
        current_price: { usd: 10 },
        total_supply: 21,
        circulating_supply: 19,
      },
    });
    const coin = await service.getCryptoById('bitcoin');
    expect(coin).toEqual(
      new CryptoCoin('bitcoin', 'Bitcoin', 'BTC', 10, 'gecko', 1, 21, 19),
    );

    mockClient().coinId.mockRejectedValue(new Error('not found'));
    const notFound = await service.getCryptoById('missing');
    expect(notFound).toBeNull();
  });

  it('setCoinIntoConfig updates global config id', () => {
    const service = new GeckoService();
    const cfg = service.setCoinIntoConfig('dogecoin');
    expect(cfg.id).toBe('dogecoin');
  });
});
