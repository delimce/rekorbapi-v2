import { CryptoType } from '@/crypto/domain/types/crypto.type';

describe('CryptoType', () => {
  describe('Type Structure', () => {
    it('should accept a valid CryptoType object with all required properties', () => {
      const validCrypto: CryptoType = {
        id: 'bitcoin',
        name: 'Bitcoin',
        symbol: 'BTC',
        price_usd: 45000.5,
        platform: 'cryptocurrency',
      };

      expect(validCrypto).toBeDefined();
      expect(validCrypto.id).toBe('bitcoin');
      expect(validCrypto.name).toBe('Bitcoin');
      expect(validCrypto.symbol).toBe('BTC');
      expect(validCrypto.price_usd).toBe(45000.5);
      expect(validCrypto.platform).toBe('cryptocurrency');
    });

    it('should accept a CryptoType object with all optional properties', () => {
      const fullCrypto: CryptoType = {
        id: 'ethereum',
        name: 'Ethereum',
        symbol: 'ETH',
        price_usd: 3000.25,
        platform: 'cryptocurrency',
        slug: 'ethereum',
        num_market_pairs: 500,
        date_added: '2015-08-07T14:49:30.000Z',
        tags: ['smart-contracts', 'defi'],
        max_supply: null,
        circulating_supply: 120000000,
        total_supply: 120000000,
        rank: 2,
        last_updated: '2025-08-10T12:00:00.000Z',
      };

      expect(fullCrypto).toBeDefined();
      expect(fullCrypto.slug).toBe('ethereum');
      expect(fullCrypto.num_market_pairs).toBe(500);
      expect(fullCrypto.date_added).toBe('2015-08-07T14:49:30.000Z');
      expect(fullCrypto.tags).toEqual(['smart-contracts', 'defi']);
      expect(fullCrypto.max_supply).toBeNull();
      expect(fullCrypto.circulating_supply).toBe(120000000);
      expect(fullCrypto.total_supply).toBe(120000000);
      expect(fullCrypto.rank).toBe(2);
      expect(fullCrypto.last_updated).toBe('2025-08-10T12:00:00.000Z');
    });

    it('should accept CryptoType object without optional properties', () => {
      const minimalCrypto: CryptoType = {
        id: 'dogecoin',
        name: 'Dogecoin',
        symbol: 'DOGE',
        price_usd: 0.08,
        platform: 'cryptocurrency',
      };

      expect(minimalCrypto).toBeDefined();
      expect(minimalCrypto.slug).toBeUndefined();
      expect(minimalCrypto.num_market_pairs).toBeUndefined();
      expect(minimalCrypto.date_added).toBeUndefined();
      expect(minimalCrypto.tags).toBeUndefined();
      expect(minimalCrypto.max_supply).toBeUndefined();
      expect(minimalCrypto.circulating_supply).toBeUndefined();
      expect(minimalCrypto.total_supply).toBeUndefined();
      expect(minimalCrypto.rank).toBeUndefined();
      expect(minimalCrypto.last_updated).toBeUndefined();
    });
  });

  describe('Property Types', () => {
    it('should handle string properties correctly', () => {
      const crypto: CryptoType = {
        id: 'test-coin',
        name: 'Test Coin',
        symbol: 'TST',
        price_usd: 1.0,
        platform: 'test-platform',
        slug: 'test-coin-slug',
        date_added: '2025-01-01T00:00:00.000Z',
        last_updated: '2025-08-10T12:00:00.000Z',
      };

      expect(typeof crypto.id).toBe('string');
      expect(typeof crypto.name).toBe('string');
      expect(typeof crypto.symbol).toBe('string');
      expect(typeof crypto.platform).toBe('string');
      expect(typeof crypto.slug).toBe('string');
      expect(typeof crypto.date_added).toBe('string');
      expect(typeof crypto.last_updated).toBe('string');
    });

    it('should handle number properties correctly', () => {
      const crypto: CryptoType = {
        id: 'number-test',
        name: 'Number Test',
        symbol: 'NUM',
        price_usd: 123.45,
        platform: 'test',
        num_market_pairs: 100,
        max_supply: 1000000,
        circulating_supply: 500000,
        total_supply: 800000,
        rank: 5,
      };

      expect(typeof crypto.price_usd).toBe('number');
      expect(typeof crypto.num_market_pairs).toBe('number');
      expect(typeof crypto.max_supply).toBe('number');
      expect(typeof crypto.circulating_supply).toBe('number');
      expect(typeof crypto.total_supply).toBe('number');
      expect(typeof crypto.rank).toBe('number');
    });

    it('should handle array properties correctly', () => {
      const crypto: CryptoType = {
        id: 'array-test',
        name: 'Array Test',
        symbol: 'ARR',
        price_usd: 1.0,
        platform: 'test',
        tags: ['tag1', 'tag2', 'tag3'],
      };

      expect(Array.isArray(crypto.tags)).toBe(true);
      expect(crypto.tags).toHaveLength(3);
      expect(crypto.tags).toContain('tag1');
      expect(crypto.tags).toContain('tag2');
      expect(crypto.tags).toContain('tag3');
    });

    it('should handle empty tags array', () => {
      const crypto: CryptoType = {
        id: 'empty-tags',
        name: 'Empty Tags',
        symbol: 'EMP',
        price_usd: 1.0,
        platform: 'test',
        tags: [],
      };

      expect(Array.isArray(crypto.tags)).toBe(true);
      expect(crypto.tags).toHaveLength(0);
    });
  });

  describe('Edge Cases', () => {
    it('should handle zero values for numeric properties', () => {
      const crypto: CryptoType = {
        id: 'zero-values',
        name: 'Zero Values',
        symbol: 'ZERO',
        price_usd: 0,
        platform: 'test',
        num_market_pairs: 0,
        max_supply: 0,
        circulating_supply: 0,
        total_supply: 0,
        rank: 0,
      };

      expect(crypto.price_usd).toBe(0);
      expect(crypto.num_market_pairs).toBe(0);
      expect(crypto.max_supply).toBe(0);
      expect(crypto.circulating_supply).toBe(0);
      expect(crypto.total_supply).toBe(0);
      expect(crypto.rank).toBe(0);
    });

    it('should handle negative values for price', () => {
      const crypto: CryptoType = {
        id: 'negative-price',
        name: 'Negative Price',
        symbol: 'NEG',
        price_usd: -1.5,
        platform: 'test',
      };

      expect(crypto.price_usd).toBe(-1.5);
    });

    it('should handle very large numbers', () => {
      const crypto: CryptoType = {
        id: 'large-numbers',
        name: 'Large Numbers',
        symbol: 'BIG',
        price_usd: 999999999.99,
        platform: 'test',
        max_supply: 21000000000000,
        circulating_supply: 18900000000000,
        total_supply: 21000000000000,
        num_market_pairs: 10000,
      };

      expect(crypto.price_usd).toBe(999999999.99);
      expect(crypto.max_supply).toBe(21000000000000);
      expect(crypto.circulating_supply).toBe(18900000000000);
      expect(crypto.total_supply).toBe(21000000000000);
      expect(crypto.num_market_pairs).toBe(10000);
    });

    it('should handle decimal values correctly', () => {
      const crypto: CryptoType = {
        id: 'decimal-values',
        name: 'Decimal Values',
        symbol: 'DEC',
        price_usd: 0.000001,
        platform: 'test',
        circulating_supply: 1000000.5,
        total_supply: 2000000.75,
      };

      expect(crypto.price_usd).toBe(0.000001);
      expect(crypto.circulating_supply).toBe(1000000.5);
      expect(crypto.total_supply).toBe(2000000.75);
    });
  });

  describe('Real-world Examples', () => {
    it('should model Bitcoin-like cryptocurrency', () => {
      const bitcoin: CryptoType = {
        id: 'bitcoin',
        name: 'Bitcoin',
        symbol: 'BTC',
        price_usd: 45000,
        platform: 'cryptocurrency',
        slug: 'bitcoin',
        num_market_pairs: 10000,
        date_added: '2013-04-28T00:00:00.000Z',
        tags: [
          'mineable',
          'pow',
          'sha-256',
          'store-of-value',
          'state-channel',
          'coinbase-ventures-portfolio',
          'three-arrows-capital-portfolio',
          'polychain-capital-portfolio',
          'binance-labs-portfolio',
        ],
        max_supply: 21000000,
        circulating_supply: 19000000,
        total_supply: 19000000,
        rank: 1,
        last_updated: '2025-08-10T12:00:00.000Z',
      };

      expect(bitcoin).toMatchObject({
        id: 'bitcoin',
        name: 'Bitcoin',
        symbol: 'BTC',
        platform: 'cryptocurrency',
        rank: 1,
      });
    });

    it('should model Ethereum-like cryptocurrency', () => {
      const ethereum: CryptoType = {
        id: 'ethereum',
        name: 'Ethereum',
        symbol: 'ETH',
        price_usd: 3000,
        platform: 'cryptocurrency',
        slug: 'ethereum',
        num_market_pairs: 5000,
        date_added: '2015-08-07T14:49:30.000Z',
        tags: [
          'mineable',
          'pos',
          'smart-contracts',
          'ethereum-ecosystem',
          'coinbase-ventures-portfolio',
        ],
        max_supply: null,
        circulating_supply: 120000000,
        total_supply: 120000000,
        rank: 2,
        last_updated: '2025-08-10T12:00:00.000Z',
      };

      expect(ethereum).toMatchObject({
        id: 'ethereum',
        name: 'Ethereum',
        symbol: 'ETH',
        platform: 'cryptocurrency',
        rank: 2,
        max_supply: null,
      });
    });

    it('should model a meme coin with high supply', () => {
      const memeCoin: CryptoType = {
        id: 'shiba-inu',
        name: 'Shiba Inu',
        symbol: 'SHIB',
        price_usd: 0.00001,
        platform: 'ethereum',
        slug: 'shiba-inu',
        num_market_pairs: 500,
        date_added: '2020-08-01T00:00:00.000Z',
        tags: ['memes', 'ethereum-ecosystem', 'doggone-doggerel'],
        max_supply: 1000000000000000,
        circulating_supply: 589735030408323,
        total_supply: 999982344977895,
        rank: 15,
        last_updated: '2025-08-10T12:00:00.000Z',
      };

      expect(memeCoin.price_usd).toBeLessThan(0.001);
      expect(memeCoin.circulating_supply).toBeGreaterThan(500000000000000);
    });
  });

  describe('Type Compatibility', () => {
    it('should be compatible with partial objects for updates', () => {
      const partialUpdate: Partial<CryptoType> = {
        price_usd: 50000,
        last_updated: '2025-08-10T13:00:00.000Z',
      };

      expect(partialUpdate.price_usd).toBe(50000);
      expect(partialUpdate.last_updated).toBe('2025-08-10T13:00:00.000Z');
    });

    it('should work with object spread operator', () => {
      const baseCrypto: CryptoType = {
        id: 'base-coin',
        name: 'Base Coin',
        symbol: 'BASE',
        price_usd: 100,
        platform: 'test',
      };

      const updatedCrypto: CryptoType = {
        ...baseCrypto,
        price_usd: 150,
        rank: 10,
      };

      expect(updatedCrypto.price_usd).toBe(150);
      expect(updatedCrypto.rank).toBe(10);
      expect(updatedCrypto.id).toBe('base-coin');
      expect(updatedCrypto.name).toBe('Base Coin');
    });

    it('should work with array of CryptoType', () => {
      const cryptoList: CryptoType[] = [
        {
          id: 'coin1',
          name: 'Coin 1',
          symbol: 'C1',
          price_usd: 100,
          platform: 'test',
        },
        {
          id: 'coin2',
          name: 'Coin 2',
          symbol: 'C2',
          price_usd: 200,
          platform: 'test',
        },
      ];

      expect(cryptoList).toHaveLength(2);
      expect(cryptoList[0].id).toBe('coin1');
      expect(cryptoList[1].id).toBe('coin2');
    });
  });
});
