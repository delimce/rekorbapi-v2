/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { CurrencyUseCase } from '@Fiat/application/currency/currency-use-case';
import {
    currencyService,
    CurrencyServiceInterface,
} from '@Fiat/domain/interfaces/currencyService.interface';
import { FiatPrice } from '@Fiat/domain/dto/fiatPrice';

describe('CurrencyUseCase', () => {
    let useCase: CurrencyUseCase;
    let currencyServiceMock: jest.Mocked<CurrencyServiceInterface>;

    const mockFiatPrice = new FiatPrice(
        'EUR',
        'Euro',
        0.85,
        1.0,
        'floatRates',
        '2025-08-10T12:00:00.000Z',
    );

    const mockFiatPrices = [
        new FiatPrice(
            'EUR',
            'Euro',
            0.85,
            1.0,
            'floatRates',
            '2025-08-10T12:00:00.000Z',
        ),
        new FiatPrice(
            'GBP',
            'British Pound Sterling',
            0.75,
            1.0,
            'floatRates',
            '2025-08-10T12:00:00.000Z',
        ),
        new FiatPrice(
            'JPY',
            'Japanese Yen',
            110.0,
            1.0,
            'floatRates',
            '2025-08-10T12:00:00.000Z',
        ),
    ];

    beforeEach(async () => {
        const mockCurrencyService: jest.Mocked<CurrencyServiceInterface> = {
            getByCurrency: jest.fn(),
            toFiatPrice: jest.fn(),
            getAll: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CurrencyUseCase,
                {
                    provide: currencyService,
                    useValue: mockCurrencyService,
                },
            ],
        }).compile();

        useCase = module.get<CurrencyUseCase>(CurrencyUseCase);
        currencyServiceMock = module.get(currencyService);
    });

    it('should be defined', () => {
        expect(useCase).toBeDefined();
    });

    describe('getByCurrency', () => {
        it('should return FiatPrice for existing currency', async () => {
            currencyServiceMock.getByCurrency.mockResolvedValue(mockFiatPrice);

            const result = await useCase.getByCurrency('EUR');

            expect(currencyServiceMock.getByCurrency).toHaveBeenCalledWith('EUR');
            expect(currencyServiceMock.getByCurrency).toHaveBeenCalledTimes(1);
            expect(result).toEqual(mockFiatPrice);
            expect(result).toBeInstanceOf(FiatPrice);
        });

        it('should return null for non-existing currency', async () => {
            currencyServiceMock.getByCurrency.mockResolvedValue(null);

            const result = await useCase.getByCurrency('NONEXISTENT');

            expect(currencyServiceMock.getByCurrency).toHaveBeenCalledWith(
                'NONEXISTENT',
            );
            expect(currencyServiceMock.getByCurrency).toHaveBeenCalledTimes(1);
            expect(result).toBeNull();
        });

        it('should handle uppercase currency codes', async () => {
            currencyServiceMock.getByCurrency.mockResolvedValue(mockFiatPrice);

            const result = await useCase.getByCurrency('EUR');

            expect(currencyServiceMock.getByCurrency).toHaveBeenCalledWith('EUR');
            expect(result).toEqual(mockFiatPrice);
        });

        it('should handle lowercase currency codes', async () => {
            currencyServiceMock.getByCurrency.mockResolvedValue(mockFiatPrice);

            const result = await useCase.getByCurrency('eur');

            expect(currencyServiceMock.getByCurrency).toHaveBeenCalledWith('eur');
            expect(result).toEqual(mockFiatPrice);
        });

        it('should handle empty string currency', async () => {
            currencyServiceMock.getByCurrency.mockResolvedValue(null);

            const result = await useCase.getByCurrency('');

            expect(currencyServiceMock.getByCurrency).toHaveBeenCalledWith('');
            expect(result).toBeNull();
        });

        it('should propagate service errors', async () => {
            const error = new Error('Currency service unavailable');
            currencyServiceMock.getByCurrency.mockRejectedValue(error);

            await expect(useCase.getByCurrency('EUR')).rejects.toThrow(
                'Currency service unavailable',
            );
            expect(currencyServiceMock.getByCurrency).toHaveBeenCalledWith('EUR');
        });

        it('should handle network timeout errors', async () => {
            const timeoutError = new Error('Request timeout');
            currencyServiceMock.getByCurrency.mockRejectedValue(timeoutError);

            await expect(useCase.getByCurrency('USD')).rejects.toThrow(
                'Request timeout',
            );
        });

        it('should handle invalid currency format', async () => {
            currencyServiceMock.getByCurrency.mockResolvedValue(null);

            const result = await useCase.getByCurrency('123');

            expect(currencyServiceMock.getByCurrency).toHaveBeenCalledWith('123');
            expect(result).toBeNull();
        });
    });

    describe('getAll', () => {
        it('should return array of FiatPrice objects', async () => {
            currencyServiceMock.getAll.mockResolvedValue(mockFiatPrices);

            const result = await useCase.getAll();

            expect(currencyServiceMock.getAll).toHaveBeenCalledTimes(1);
            expect(currencyServiceMock.getAll).toHaveBeenCalledWith();
            expect(result).toEqual(mockFiatPrices);
            expect(result).toHaveLength(3);
            expect(result[0]).toBeInstanceOf(FiatPrice);
            expect(result[1]).toBeInstanceOf(FiatPrice);
            expect(result[2]).toBeInstanceOf(FiatPrice);
        });

        it('should return empty array when no currencies available', async () => {
            currencyServiceMock.getAll.mockResolvedValue([]);

            const result = await useCase.getAll();

            expect(currencyServiceMock.getAll).toHaveBeenCalledTimes(1);
            expect(result).toEqual([]);
            expect(result).toHaveLength(0);
        });

        it('should handle service returning null', async () => {
            currencyServiceMock.getAll.mockResolvedValue(null as any);

            const result = await useCase.getAll();

            expect(currencyServiceMock.getAll).toHaveBeenCalledTimes(1);
            expect(result).toBeNull();
        });

        it('should propagate service errors', async () => {
            const error = new Error('Service unavailable');
            currencyServiceMock.getAll.mockRejectedValue(error);

            await expect(useCase.getAll()).rejects.toThrow('Service unavailable');
            expect(currencyServiceMock.getAll).toHaveBeenCalledTimes(1);
        });

        it('should handle network errors gracefully', async () => {
            const networkError = new Error('Network error');
            currencyServiceMock.getAll.mockRejectedValue(networkError);

            await expect(useCase.getAll()).rejects.toThrow('Network error');
        });

        it('should handle partial data corruption', async () => {
            const partialData = [
                mockFiatPrices[0],
                null,
                mockFiatPrices[2],
            ] as FiatPrice[];
            currencyServiceMock.getAll.mockResolvedValue(partialData);

            const result = await useCase.getAll();

            expect(result).toEqual(partialData);
            expect(result).toHaveLength(3);
            expect(result[0]).toBeInstanceOf(FiatPrice);
            expect(result[1]).toBeNull();
            expect(result[2]).toBeInstanceOf(FiatPrice);
        });

        it('should handle API rate limiting', async () => {
            const rateLimitError = new Error('Rate limit exceeded');
            currencyServiceMock.getAll.mockRejectedValue(rateLimitError);

            await expect(useCase.getAll()).rejects.toThrow('Rate limit exceeded');
        });
    });

    describe('dependency injection', () => {
        it('should inject the correct currency service', () => {
            expect(currencyServiceMock).toBeDefined();
            expect(currencyServiceMock.getByCurrency).toBeDefined();
            expect(currencyServiceMock.getAll).toBeDefined();
            expect(currencyServiceMock.toFiatPrice).toBeDefined();
        });

        it('should use the injected service for operations', async () => {
            currencyServiceMock.getByCurrency.mockResolvedValue(mockFiatPrice);
            currencyServiceMock.getAll.mockResolvedValue(mockFiatPrices);

            await useCase.getByCurrency('EUR');
            await useCase.getAll();

            expect(currencyServiceMock.getByCurrency).toHaveBeenCalled();
            expect(currencyServiceMock.getAll).toHaveBeenCalled();
        });
    });

    describe('error handling', () => {
        it('should handle undefined input gracefully', async () => {
            currencyServiceMock.getByCurrency.mockResolvedValue(null);

            const result = await useCase.getByCurrency(undefined as any);

            expect(currencyServiceMock.getByCurrency).toHaveBeenCalledWith(undefined);
            expect(result).toBeNull();
        });

        it('should handle null input gracefully', async () => {
            currencyServiceMock.getByCurrency.mockResolvedValue(null);

            const result = await useCase.getByCurrency(null as any);

            expect(currencyServiceMock.getByCurrency).toHaveBeenCalledWith(null);
            expect(result).toBeNull();
        });

        it('should handle very long currency codes', async () => {
            const longCurrencyCode = 'A'.repeat(1000);
            currencyServiceMock.getByCurrency.mockResolvedValue(null);

            const result = await useCase.getByCurrency(longCurrencyCode);

            expect(currencyServiceMock.getByCurrency).toHaveBeenCalledWith(
                longCurrencyCode,
            );
            expect(result).toBeNull();
        });

        it('should handle special characters in currency codes', async () => {
            const specialCurrencyCode = 'E@R#';
            currencyServiceMock.getByCurrency.mockResolvedValue(null);

            const result = await useCase.getByCurrency(specialCurrencyCode);

            expect(currencyServiceMock.getByCurrency).toHaveBeenCalledWith(
                specialCurrencyCode,
            );
            expect(result).toBeNull();
        });
    });
});
