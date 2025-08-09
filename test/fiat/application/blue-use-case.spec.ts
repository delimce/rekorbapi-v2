/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { BlueUseCase } from '@Fiat/application/prices/blue-use-case';
import {
    bluePriceService,
    PriceServiceInterface,
} from '@Fiat/domain/interfaces/priceService.interface';
import { FiatPrice } from '@Fiat/domain/dto/fiatPrice';

describe('BlueUseCase', () => {
    let useCase: BlueUseCase;
    let blueServiceMock: jest.Mocked<PriceServiceInterface>;

    const mockFiatPrice = new FiatPrice(
        'BLUE',
        'ars',
        425.5,
        1.0,
        'BLUE',
        '2025-08-10T12:00:00.000Z',
    );

    beforeEach(async () => {
        const mockBlueService: jest.Mocked<PriceServiceInterface> = {
            getPrice: jest.fn(),
            getFiatPrice: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                BlueUseCase,
                {
                    provide: bluePriceService,
                    useValue: mockBlueService,
                },
            ],
        }).compile();

        useCase = module.get<BlueUseCase>(BlueUseCase);
        blueServiceMock = module.get(bluePriceService);
    });

    it('should be defined', () => {
        expect(useCase).toBeDefined();
    });

    describe('getPrice', () => {
        it('should return FiatPrice with Blue dollar data', async () => {
            blueServiceMock.getFiatPrice.mockResolvedValue(mockFiatPrice);

            const result = await useCase.getPrice();

            expect(blueServiceMock.getFiatPrice).toHaveBeenCalledTimes(1);
            expect(blueServiceMock.getFiatPrice).toHaveBeenCalledWith();
            expect(result).toEqual(mockFiatPrice);
            expect(result).toBeInstanceOf(FiatPrice);
            expect(result.code).toBe('BLUE');
            expect(result.currency).toBe('ars');
            expect(result.price).toBe(425.5);
            expect(result.source).toBe('BLUE');
        });

        it('should handle successful price retrieval', async () => {
            const highPriceFiat = new FiatPrice(
                'BLUE',
                'ars',
                550.25,
                1.0,
                'BLUE',
                '2025-08-10T15:30:00.000Z',
            );
            blueServiceMock.getFiatPrice.mockResolvedValue(highPriceFiat);

            const result = await useCase.getPrice();

            expect(result.price).toBe(550.25);
            expect(result.date).toBe('2025-08-10T15:30:00.000Z');
        });

        it('should handle zero price scenarios', async () => {
            const zeroPriceFiat = new FiatPrice(
                'BLUE',
                'ars',
                0.0,
                1.0,
                'BLUE',
                '2025-08-10T12:00:00.000Z',
            );
            blueServiceMock.getFiatPrice.mockResolvedValue(zeroPriceFiat);

            const result = await useCase.getPrice();

            expect(result.price).toBe(0.0);
            expect(result.code).toBe('BLUE');
        });

        it('should propagate API service errors', async () => {
            const error = new Error('Bluelytics API is unavailable');
            blueServiceMock.getFiatPrice.mockRejectedValue(error);

            await expect(useCase.getPrice()).rejects.toThrow(
                'Bluelytics API is unavailable',
            );
            expect(blueServiceMock.getFiatPrice).toHaveBeenCalledTimes(1);
        });

        it('should handle network timeout errors', async () => {
            const timeoutError = new Error('Request timeout after 4000ms');
            blueServiceMock.getFiatPrice.mockRejectedValue(timeoutError);

            await expect(useCase.getPrice()).rejects.toThrow(
                'Request timeout after 4000ms',
            );
        });

        it('should handle JSON parsing errors', async () => {
            const jsonError = new Error('Invalid JSON response from API');
            blueServiceMock.getFiatPrice.mockRejectedValue(jsonError);

            await expect(useCase.getPrice()).rejects.toThrow(
                'Invalid JSON response from API',
            );
        });

        it('should handle API rate limiting', async () => {
            const rateLimitError = new Error('API rate limit exceeded');
            blueServiceMock.getFiatPrice.mockRejectedValue(rateLimitError);

            await expect(useCase.getPrice()).rejects.toThrow(
                'API rate limit exceeded',
            );
        });

        it('should handle service returning null', async () => {
            blueServiceMock.getFiatPrice.mockResolvedValue(null as any);

            const result = await useCase.getPrice();

            expect(result).toBeNull();
        });

        it('should handle service returning undefined', async () => {
            blueServiceMock.getFiatPrice.mockResolvedValue(undefined as any);

            const result = await useCase.getPrice();

            expect(result).toBeUndefined();
        });

        it('should handle very high price values (hyperinflation)', async () => {
            const hyperInflationFiat = new FiatPrice(
                'BLUE',
                'ars',
                10000.99,
                1.0,
                'BLUE',
                '2025-08-10T12:00:00.000Z',
            );
            blueServiceMock.getFiatPrice.mockResolvedValue(hyperInflationFiat);

            const result = await useCase.getPrice();

            expect(result.price).toBe(10000.99);
            expect(result.code).toBe('BLUE');
        });

        it('should handle low price values', async () => {
            const lowPriceFiat = new FiatPrice(
                'BLUE',
                'ars',
                1.5,
                1.0,
                'BLUE',
                '2025-08-10T12:00:00.000Z',
            );
            blueServiceMock.getFiatPrice.mockResolvedValue(lowPriceFiat);

            const result = await useCase.getPrice();

            expect(result.price).toBe(1.5);
            expect(result.code).toBe('BLUE');
        });

        it('should handle decimal precision correctly', async () => {
            const precisionFiat = new FiatPrice(
                'BLUE',
                'ars',
                425.123456,
                1.0,
                'BLUE',
                '2025-08-10T12:00:00.000Z',
            );
            blueServiceMock.getFiatPrice.mockResolvedValue(precisionFiat);

            const result = await useCase.getPrice();

            expect(result.price).toBe(425.123456);
        });

        it('should handle missing value_buy in API response', async () => {
            const missingValueFiat = new FiatPrice(
                'BLUE',
                'ars',
                0.0,
                1.0,
                'BLUE',
                '2025-08-10T12:00:00.000Z',
            );
            blueServiceMock.getFiatPrice.mockResolvedValue(missingValueFiat);

            const result = await useCase.getPrice();

            expect(result.price).toBe(0.0);
            expect(result.code).toBe('BLUE');
        });
    });

    describe('dependency injection', () => {
        it('should inject the correct Blue service', () => {
            expect(blueServiceMock).toBeDefined();
            expect(blueServiceMock.getFiatPrice).toBeDefined();
            expect(blueServiceMock.getPrice).toBeDefined();
        });

        it('should use the injected service for operations', async () => {
            blueServiceMock.getFiatPrice.mockResolvedValue(mockFiatPrice);

            await useCase.getPrice();

            expect(blueServiceMock.getFiatPrice).toHaveBeenCalled();
        });

        it('should only call getFiatPrice method', async () => {
            blueServiceMock.getFiatPrice.mockResolvedValue(mockFiatPrice);

            await useCase.getPrice();

            expect(blueServiceMock.getFiatPrice).toHaveBeenCalledTimes(1);
            expect(blueServiceMock.getPrice).not.toHaveBeenCalled();
        });
    });

    describe('error scenarios', () => {
        it('should handle connection refused errors', async () => {
            const connectionError = new Error(
                'Connection refused to api.bluelytics.com.ar',
            );
            blueServiceMock.getFiatPrice.mockRejectedValue(connectionError);

            await expect(useCase.getPrice()).rejects.toThrow(
                'Connection refused to api.bluelytics.com.ar',
            );
        });

        it('should handle DNS resolution errors', async () => {
            const dnsError = new Error('DNS resolution failed for bluelytics API');
            blueServiceMock.getFiatPrice.mockRejectedValue(dnsError);

            await expect(useCase.getPrice()).rejects.toThrow(
                'DNS resolution failed for bluelytics API',
            );
        });

        it('should handle HTTP status errors', async () => {
            const httpError = new Error('HTTP 500 Internal Server Error');
            blueServiceMock.getFiatPrice.mockRejectedValue(httpError);

            await expect(useCase.getPrice()).rejects.toThrow(
                'HTTP 500 Internal Server Error',
            );
        });

        it('should handle API maintenance errors', async () => {
            const maintenanceError = new Error('API is under maintenance');
            blueServiceMock.getFiatPrice.mockRejectedValue(maintenanceError);

            await expect(useCase.getPrice()).rejects.toThrow(
                'API is under maintenance',
            );
        });

        it('should handle malformed API response', async () => {
            const malformedError = new Error('Malformed API response structure');
            blueServiceMock.getFiatPrice.mockRejectedValue(malformedError);

            await expect(useCase.getPrice()).rejects.toThrow(
                'Malformed API response structure',
            );
        });

        it('should handle missing blue data in response', async () => {
            const missingDataError = new Error('Blue data not found in API response');
            blueServiceMock.getFiatPrice.mockRejectedValue(missingDataError);

            await expect(useCase.getPrice()).rejects.toThrow(
                'Blue data not found in API response',
            );
        });
    });

    describe('performance and reliability', () => {
        it('should handle multiple concurrent requests', async () => {
            blueServiceMock.getFiatPrice.mockResolvedValue(mockFiatPrice);

            const promises = Array(10)
                .fill(null)
                .map(() => useCase.getPrice());
            const results = await Promise.all(promises);

            expect(results).toHaveLength(10);
            expect(blueServiceMock.getFiatPrice).toHaveBeenCalledTimes(10);
            results.forEach((result) => {
                expect(result).toEqual(mockFiatPrice);
            });
        });

        it('should handle service recovery after failure', async () => {
            // First call fails
            blueServiceMock.getFiatPrice.mockRejectedValueOnce(
                new Error('Temporary API failure'),
            );
            // Second call succeeds
            blueServiceMock.getFiatPrice.mockResolvedValueOnce(mockFiatPrice);

            await expect(useCase.getPrice()).rejects.toThrow('Temporary API failure');

            const result = await useCase.getPrice();
            expect(result).toEqual(mockFiatPrice);
        });

        it('should maintain consistent behavior across calls', async () => {
            blueServiceMock.getFiatPrice.mockResolvedValue(mockFiatPrice);

            const result1 = await useCase.getPrice();
            const result2 = await useCase.getPrice();

            expect(result1).toEqual(result2);
            expect(result1).toEqual(mockFiatPrice);
            expect(blueServiceMock.getFiatPrice).toHaveBeenCalledTimes(2);
        });

        it('should handle rapid successive calls', async () => {
            blueServiceMock.getFiatPrice.mockResolvedValue(mockFiatPrice);

            const results = [];
            for (let i = 0; i < 5; i++) {
                results.push(await useCase.getPrice());
            }

            expect(results).toHaveLength(5);
            results.forEach((result) => {
                expect(result).toEqual(mockFiatPrice);
            });
        });
    });

    describe('Argentine market specifics', () => {
        it('should handle typical blue dollar price ranges', async () => {
            const typicalPrices = [300, 400, 500, 600, 700];

            for (const price of typicalPrices) {
                const fiatPrice = new FiatPrice(
                    'BLUE',
                    'ars',
                    price,
                    1.0,
                    'BLUE',
                    '2025-08-10T12:00:00.000Z',
                );
                blueServiceMock.getFiatPrice.mockResolvedValueOnce(fiatPrice);

                const result = await useCase.getPrice();
                expect(result.price).toBe(price);
                expect(result.currency).toBe('ars');
            }
        });

        it('should handle weekend and holiday scenarios', async () => {
            const weekendFiat = new FiatPrice(
                'BLUE',
                'ars',
                425.5,
                1.0,
                'BLUE',
                '2025-08-09T12:00:00.000Z', // Saturday
            );
            blueServiceMock.getFiatPrice.mockResolvedValue(weekendFiat);

            const result = await useCase.getPrice();

            expect(result).toEqual(weekendFiat);
            expect(result.date).toBe('2025-08-09T12:00:00.000Z');
        });
    });
});
