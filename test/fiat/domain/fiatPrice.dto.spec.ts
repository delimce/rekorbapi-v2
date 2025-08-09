import { FiatPrice } from '@Fiat/domain/dto/fiatPrice';
import FiatType from '@Fiat/domain/types/fiat.type';

describe('FiatPrice DTO', () => {
  describe('constructor', () => {
    it('should create a FiatPrice instance with all required properties', () => {
      // Arrange
      const code = 'USD';
      const currency = 'US Dollar';
      const price = 25.5;
      const priceUsd = 25.5;
      const source = 'BCV';
      const date = '2025-08-10';

      // Act
      const fiatPrice = new FiatPrice(
        code,
        currency,
        price,
        priceUsd,
        source,
        date,
      );

      // Assert
      expect(fiatPrice).toBeDefined();
      expect(fiatPrice.code).toBe(code);
      expect(fiatPrice.currency).toBe(currency);
      expect(fiatPrice.price).toBe(price);
      expect(fiatPrice.price_usd).toBe(priceUsd);
      expect(fiatPrice.source).toBe(source);
      expect(fiatPrice.date).toBe(date);
    });

    it('should create a FiatPrice instance with different currency data', () => {
      // Arrange
      const code = 'EUR';
      const currency = 'Euro';
      const price = 0.92;
      const priceUsd = 1.08;
      const source = 'FloatRates';
      const date = '2025-08-10T10:30:00Z';

      // Act
      const fiatPrice = new FiatPrice(
        code,
        currency,
        price,
        priceUsd,
        source,
        date,
      );

      // Assert
      expect(fiatPrice).toMatchObject({
        code: 'EUR',
        currency: 'Euro',
        price: 0.92,
        price_usd: 1.08,
        source: 'FloatRates',
        date: '2025-08-10T10:30:00Z',
      });
    });

    it('should handle zero values correctly', () => {
      // Arrange
      const code = 'TEST';
      const currency = 'Test Currency';
      const price = 0;
      const priceUsd = 0;
      const source = 'Test Source';
      const date = '2025-01-01';

      // Act
      const fiatPrice = new FiatPrice(
        code,
        currency,
        price,
        priceUsd,
        source,
        date,
      );

      // Assert
      expect(fiatPrice.price).toBe(0);
      expect(fiatPrice.price_usd).toBe(0);
      expect(fiatPrice).toBeInstanceOf(FiatPrice);
    });

    it('should handle negative values correctly', () => {
      // Arrange
      const code = 'NEGATIVE';
      const currency = 'Negative Currency';
      const price = -10.5;
      const priceUsd = -10.5;
      const source = 'Test';
      const date = '2025-08-10';

      // Act
      const fiatPrice = new FiatPrice(
        code,
        currency,
        price,
        priceUsd,
        source,
        date,
      );

      // Assert
      expect(fiatPrice.price).toBe(-10.5);
      expect(fiatPrice.price_usd).toBe(-10.5);
    });

    it('should handle large decimal numbers correctly', () => {
      // Arrange
      const code = 'BTC';
      const currency = 'Bitcoin';
      const price = 45123.456789;
      const priceUsd = 45123.456789;
      const source = 'CoinGecko';
      const date = '2025-08-10T15:45:30.123Z';

      // Act
      const fiatPrice = new FiatPrice(
        code,
        currency,
        price,
        priceUsd,
        source,
        date,
      );

      // Assert
      expect(fiatPrice.price).toBe(45123.456789);
      expect(fiatPrice.price_usd).toBe(45123.456789);
      expect(fiatPrice.code).toBe('BTC');
      expect(fiatPrice.currency).toBe('Bitcoin');
    });
  });

  describe('type compliance', () => {
    it('should implement FiatType interface', () => {
      // Arrange
      const fiatPrice = new FiatPrice(
        'USD',
        'US Dollar',
        1.0,
        1.0,
        'BCV',
        '2025-08-10',
      );

      // Act & Assert
      const fiatType: FiatType = fiatPrice;
      expect(fiatType.code).toBe('USD');
      expect(fiatType.currency).toBe('US Dollar');
      expect(fiatType.price).toBe(1.0);
      expect(fiatType.price_usd).toBe(1.0);
      expect(fiatType.source).toBe('BCV');
    });

    it('should have all properties required by FiatType', () => {
      // Arrange
      const fiatPrice = new FiatPrice(
        'GBP',
        'British Pound',
        0.79,
        1.27,
        'Bank',
        '2025-08-10',
      );

      // Assert - Check that all FiatType properties exist
      expect(fiatPrice).toHaveProperty('code');
      expect(fiatPrice).toHaveProperty('currency');
      expect(fiatPrice).toHaveProperty('price');
      expect(fiatPrice).toHaveProperty('price_usd');
      expect(fiatPrice).toHaveProperty('source');

      // Additional property from FiatPrice (not in FiatType)
      expect(fiatPrice).toHaveProperty('date');
    });
  });

  describe('property types', () => {
    it('should have correct property types', () => {
      // Arrange
      const fiatPrice = new FiatPrice(
        'CAD',
        'Canadian Dollar',
        1.35,
        0.74,
        'Bank of Canada',
        '2025-08-10',
      );

      // Assert
      expect(typeof fiatPrice.code).toBe('string');
      expect(typeof fiatPrice.currency).toBe('string');
      expect(typeof fiatPrice.price).toBe('number');
      expect(typeof fiatPrice.price_usd).toBe('number');
      expect(typeof fiatPrice.source).toBe('string');
      expect(typeof fiatPrice.date).toBe('string');
    });
  });

  describe('edge cases', () => {
    it('should handle empty string values', () => {
      // Arrange & Act
      const fiatPrice = new FiatPrice('', '', 0, 0, '', '');

      // Assert
      expect(fiatPrice.code).toBe('');
      expect(fiatPrice.currency).toBe('');
      expect(fiatPrice.source).toBe('');
      expect(fiatPrice.date).toBe('');
    });

    it('should handle very large numbers', () => {
      // Arrange
      const largeNumber = Number.MAX_SAFE_INTEGER;
      const fiatPrice = new FiatPrice(
        'LARGE',
        'Large Currency',
        largeNumber,
        largeNumber,
        'Test',
        '2025-08-10',
      );

      // Assert
      expect(fiatPrice.price).toBe(largeNumber);
      expect(fiatPrice.price_usd).toBe(largeNumber);
    });

    it('should handle very small numbers', () => {
      // Arrange
      const smallNumber = Number.MIN_VALUE;
      const fiatPrice = new FiatPrice(
        'SMALL',
        'Small Currency',
        smallNumber,
        smallNumber,
        'Test',
        '2025-08-10',
      );

      // Assert
      expect(fiatPrice.price).toBe(smallNumber);
      expect(fiatPrice.price_usd).toBe(smallNumber);
    });

    it('should handle special date formats', () => {
      // Arrange
      const isoDate = new Date().toISOString();
      const fiatPrice = new FiatPrice(
        'JPY',
        'Japanese Yen',
        150.25,
        0.0067,
        'Bank of Japan',
        isoDate,
      );

      // Assert
      expect(fiatPrice.date).toBe(isoDate);
      expect(fiatPrice.code).toBe('JPY');
      expect(fiatPrice.currency).toBe('Japanese Yen');
    });
  });

  describe('real-world scenarios', () => {
    it('should create Venezuelan Bolivar price from BCV', () => {
      // Arrange - Typical Venezuelan Bolivar scenario
      const fiatPrice = new FiatPrice(
        'VES',
        'Venezuelan Bolívar Soberano',
        36.5,
        0.027,
        'BCV',
        '2025-08-10T12:00:00-04:00',
      );

      // Assert
      expect(fiatPrice.code).toBe('VES');
      expect(fiatPrice.currency).toBe('Venezuelan Bolívar Soberano');
      expect(fiatPrice.price).toBe(36.5);
      expect(fiatPrice.price_usd).toBeCloseTo(0.027, 3);
      expect(fiatPrice.source).toBe('BCV');
    });

    it('should create Blue Dollar rate', () => {
      // Arrange - Argentine Blue Dollar scenario
      const fiatPrice = new FiatPrice(
        'ARS',
        'Argentine Peso (Blue)',
        1200.0,
        0.00083,
        'Blue Market',
        '2025-08-10T16:30:00-03:00',
      );

      // Assert
      expect(fiatPrice.code).toBe('ARS');
      expect(fiatPrice.currency).toBe('Argentine Peso (Blue)');
      expect(fiatPrice.price).toBe(1200.0);
      expect(fiatPrice.price_usd).toBeCloseTo(0.00083, 5);
      expect(fiatPrice.source).toBe('Blue Market');
    });

    it('should create stable currency rate', () => {
      // Arrange - Stable currency like USD/EUR
      const fiatPrice = new FiatPrice(
        'CHF',
        'Swiss Franc',
        0.89,
        1.12,
        'Swiss National Bank',
        '2025-08-10T14:15:30+01:00',
      );

      // Assert
      expect(fiatPrice.code).toBe('CHF');
      expect(fiatPrice.currency).toBe('Swiss Franc');
      expect(fiatPrice.price).toBe(0.89);
      expect(fiatPrice.price_usd).toBe(1.12);
      expect(fiatPrice.source).toBe('Swiss National Bank');
    });
  });
});
