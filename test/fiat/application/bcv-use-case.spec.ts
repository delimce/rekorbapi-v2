/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { BcvUseCase } from '@Fiat/application/prices/bcv-use-case';
import {
    bcvPriceService,
    PriceServiceInterface,
} from '@Fiat/domain/interfaces/priceService.interface';
import { FiatPrice } from '@Fiat/domain/dto/fiatPrice';

describe('BcvUseCase', () => {
    let useCase: BcvUseCase;
    let bcvServiceMock: jest.Mocked<PriceServiceInterface>;

    const mockFiatPrice = new FiatPrice(
        'BCV',
        'ves',
        36.5,
        1.0,
        'BCV',
        '2025-08-10T12:00:00.000Z',
    );

    beforeEach(async () => {
        const mockBcvService: jest.Mocked<PriceServiceInterface> = {
            getPrice: jest.fn(),
            getFiatPrice: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                BcvUseCase,
                {
                    provide: bcvPriceService,
                    useValue: mockBcvService,
                },
            ],
        }).compile();

        useCase = module.get<BcvUseCase>(BcvUseCase);
        bcvServiceMock = module.get(bcvPriceService);
    });

    it('should be defined', () => {
        expect(useCase).toBeDefined();
    });

    describe('getPrice', () => {
        it('should return FiatPrice with BCV data', async () => {
            bcvServiceMock.getFiatPrice.mockResolvedValue(mockFiatPrice);

            const result = await useCase.getPrice();

            expect(bcvServiceMock.getFiatPrice).toHaveBeenCalledTimes(1);
            expect(bcvServiceMock.getFiatPrice).toHaveBeenCalledWith();
            expect(result).toEqual(mockFiatPrice);
            expect(result).toBeInstanceOf(FiatPrice);
            expect(result.code).toBe('BCV');
            expect(result.currency).toBe('ves');
            expect(result.price).toBe(36.5);
            expect(result.source).toBe('BCV');
        });

        it('should handle successful price retrieval', async () => {
            const highPriceFiat = new FiatPrice(
                'BCV',
                'ves',
                45.75,
                1.0,
                'BCV',
                '2025-08-10T15:30:00.000Z',
            );
            bcvServiceMock.getFiatPrice.mockResolvedValue(highPriceFiat);

            const result = await useCase.getPrice();

            expect(result.price).toBe(45.75);
            expect(result.date).toBe('2025-08-10T15:30:00.000Z');
        });

        it('should handle zero price scenarios', async () => {
            const zeroPriceFiat = new FiatPrice(
                'BCV',
                'ves',
                0.0,
                1.0,
                'BCV',
                '2025-08-10T12:00:00.000Z',
            );
            bcvServiceMock.getFiatPrice.mockResolvedValue(zeroPriceFiat);

            const result = await useCase.getPrice();

            expect(result.price).toBe(0.0);
            expect(result.code).toBe('BCV');
        });

        it('should propagate service errors', async () => {
            const error = new Error('BCV website is unavailable');
            bcvServiceMock.getFiatPrice.mockRejectedValue(error);

            await expect(useCase.getPrice()).rejects.toThrow(
                'BCV website is unavailable',
            );
            expect(bcvServiceMock.getFiatPrice).toHaveBeenCalledTimes(1);
        });

        it('should handle network timeout errors', async () => {
            const timeoutError = new Error('Request timeout');
            bcvServiceMock.getFiatPrice.mockRejectedValue(timeoutError);

            await expect(useCase.getPrice()).rejects.toThrow('Request timeout');
        });

        it('should handle SSL certificate errors', async () => {
            const sslError = new Error('SSL certificate verification failed');
            bcvServiceMock.getFiatPrice.mockRejectedValue(sslError);

            await expect(useCase.getPrice()).rejects.toThrow(
                'SSL certificate verification failed',
            );
        });

        it('should handle HTML parsing errors', async () => {
            const parseError = new Error('Unable to parse BCV website content');
            bcvServiceMock.getFiatPrice.mockRejectedValue(parseError);

            await expect(useCase.getPrice()).rejects.toThrow(
                'Unable to parse BCV website content',
            );
        });

        it('should handle service returning null', async () => {
            bcvServiceMock.getFiatPrice.mockResolvedValue(null as any);

            const result = await useCase.getPrice();

            expect(result).toBeNull();
        });

        it('should handle service returning undefined', async () => {
            bcvServiceMock.getFiatPrice.mockResolvedValue(undefined as any);

            const result = await useCase.getPrice();

            expect(result).toBeUndefined();
        });

        it('should handle very high price values', async () => {
            const highPriceFiat = new FiatPrice(
                'BCV',
                'ves',
                999999.99,
                1.0,
                'BCV',
                '2025-08-10T12:00:00.000Z',
            );
            bcvServiceMock.getFiatPrice.mockResolvedValue(highPriceFiat);

            const result = await useCase.getPrice();

            expect(result.price).toBe(999999.99);
            expect(result.code).toBe('BCV');
        });

        it('should handle negative price values', async () => {
            const negativePriceFiat = new FiatPrice(
                'BCV',
                'ves',
                -1.0,
                1.0,
                'BCV',
                '2025-08-10T12:00:00.000Z',
            );
            bcvServiceMock.getFiatPrice.mockResolvedValue(negativePriceFiat);

            const result = await useCase.getPrice();

            expect(result.price).toBe(-1.0);
            expect(result.code).toBe('BCV');
        });

        it('should handle decimal precision correctly', async () => {
            const precisionFiat = new FiatPrice(
                'BCV',
                'ves',
                36.123456789,
                1.0,
                'BCV',
                '2025-08-10T12:00:00.000Z',
            );
            bcvServiceMock.getFiatPrice.mockResolvedValue(precisionFiat);

            const result = await useCase.getPrice();

            expect(result.price).toBe(36.123456789);
        });
    });

    describe('dependency injection', () => {
        it('should inject the correct BCV service', () => {
            expect(bcvServiceMock).toBeDefined();
            expect(bcvServiceMock.getFiatPrice).toBeDefined();
            expect(bcvServiceMock.getPrice).toBeDefined();
        });

        it('should use the injected service for operations', async () => {
            bcvServiceMock.getFiatPrice.mockResolvedValue(mockFiatPrice);

            await useCase.getPrice();

            expect(bcvServiceMock.getFiatPrice).toHaveBeenCalled();
        });

        it('should only call getFiatPrice method', async () => {
            bcvServiceMock.getFiatPrice.mockResolvedValue(mockFiatPrice);

            await useCase.getPrice();

            expect(bcvServiceMock.getFiatPrice).toHaveBeenCalledTimes(1);
            expect(bcvServiceMock.getPrice).not.toHaveBeenCalled();
        });
    });

    describe('error scenarios', () => {
        it('should handle connection refused errors', async () => {
            const connectionError = new Error('Connection refused');
            bcvServiceMock.getFiatPrice.mockRejectedValue(connectionError);

            await expect(useCase.getPrice()).rejects.toThrow('Connection refused');
        });

        it('should handle DNS resolution errors', async () => {
            const dnsError = new Error('DNS resolution failed');
            bcvServiceMock.getFiatPrice.mockRejectedValue(dnsError);

            await expect(useCase.getPrice()).rejects.toThrow('DNS resolution failed');
        });

        it('should handle HTTP status errors', async () => {
            const httpError = new Error('HTTP 503 Service Unavailable');
            bcvServiceMock.getFiatPrice.mockRejectedValue(httpError);

            await expect(useCase.getPrice()).rejects.toThrow(
                'HTTP 503 Service Unavailable',
            );
        });

        it('should handle malformed response errors', async () => {
            const malformedError = new Error('Invalid response format');
            bcvServiceMock.getFiatPrice.mockRejectedValue(malformedError);

            await expect(useCase.getPrice()).rejects.toThrow(
                'Invalid response format',
            );
        });

        it('should handle rate limiting errors', async () => {
            const rateLimitError = new Error('Too many requests');
            bcvServiceMock.getFiatPrice.mockRejectedValue(rateLimitError);

            await expect(useCase.getPrice()).rejects.toThrow('Too many requests');
        });
    });

    describe('performance and reliability', () => {
        it('should handle multiple concurrent requests', async () => {
            bcvServiceMock.getFiatPrice.mockResolvedValue(mockFiatPrice);

            const promises = Array(5)
                .fill(null)
                .map(() => useCase.getPrice());
            const results = await Promise.all(promises);

            expect(results).toHaveLength(5);
            expect(bcvServiceMock.getFiatPrice).toHaveBeenCalledTimes(5);
            results.forEach((result) => {
                expect(result).toEqual(mockFiatPrice);
            });
        });

        it('should handle service recovery after failure', async () => {
            // First call fails
            bcvServiceMock.getFiatPrice.mockRejectedValueOnce(
                new Error('Temporary failure'),
            );
            // Second call succeeds
            bcvServiceMock.getFiatPrice.mockResolvedValueOnce(mockFiatPrice);

            await expect(useCase.getPrice()).rejects.toThrow('Temporary failure');

            const result = await useCase.getPrice();
            expect(result).toEqual(mockFiatPrice);
        });

        it('should maintain consistent behavior across calls', async () => {
            bcvServiceMock.getFiatPrice.mockResolvedValue(mockFiatPrice);

            const result1 = await useCase.getPrice();
            const result2 = await useCase.getPrice();

            expect(result1).toEqual(result2);
            expect(result1).toEqual(mockFiatPrice);
            expect(bcvServiceMock.getFiatPrice).toHaveBeenCalledTimes(2);
        });
    });
});
