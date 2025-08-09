/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { CurrencyController } from '@Fiat/infrastructure/controllers/currency.controller';
import { CurrencyUseCase } from '@Fiat/application/currency/currency-use-case';
import { LengthPipe } from '@Fiat/infrastructure/pipes/length.pipe';
import { FiatPrice } from '@Fiat/domain/dto/fiatPrice';

describe('CurrencyController', () => {
    let controller: CurrencyController;
    let currencyUseCase: jest.Mocked<CurrencyUseCase>;

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
        const mockCurrencyUseCase = {
            getByCurrency: jest.fn(),
            getAll: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            controllers: [CurrencyController],
            providers: [
                {
                    provide: CurrencyUseCase,
                    useValue: mockCurrencyUseCase,
                },
            ],
        }).compile();

        controller = module.get<CurrencyController>(CurrencyController);
        currencyUseCase = module.get(CurrencyUseCase);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('getAll', () => {
        it('should return all currencies', async () => {
            currencyUseCase.getAll.mockResolvedValue(mockFiatPrices);

            const result = await controller.getAll();

            expect(currencyUseCase.getAll).toHaveBeenCalledTimes(1);
            expect(currencyUseCase.getAll).toHaveBeenCalledWith();
            expect(result).toEqual(mockFiatPrices);
            expect(result).toHaveLength(3);
        });

        it('should return empty array when no currencies available', async () => {
            currencyUseCase.getAll.mockResolvedValue([]);

            const result = await controller.getAll();

            expect(currencyUseCase.getAll).toHaveBeenCalledTimes(1);
            expect(result).toEqual([]);
            expect(result).toHaveLength(0);
        });

        it('should propagate use case errors', async () => {
            const error = new Error('Currency service unavailable');
            currencyUseCase.getAll.mockRejectedValue(error);

            await expect(controller.getAll()).rejects.toThrow(
                'Currency service unavailable',
            );
            expect(currencyUseCase.getAll).toHaveBeenCalledTimes(1);
        });

        it('should handle network errors', async () => {
            const networkError = new Error('Network timeout');
            currencyUseCase.getAll.mockRejectedValue(networkError);

            await expect(controller.getAll()).rejects.toThrow('Network timeout');
        });

        it('should handle null response from use case', async () => {
            currencyUseCase.getAll.mockResolvedValue(null as any);

            const result = await controller.getAll();

            expect(result).toBeNull();
        });

        it('should handle multiple consecutive calls', async () => {
            currencyUseCase.getAll.mockResolvedValue(mockFiatPrices);

            const result1 = await controller.getAll();
            const result2 = await controller.getAll();

            expect(currencyUseCase.getAll).toHaveBeenCalledTimes(2);
            expect(result1).toEqual(mockFiatPrices);
            expect(result2).toEqual(mockFiatPrices);
        });

        it('should not require parameters', async () => {
            currencyUseCase.getAll.mockResolvedValue(mockFiatPrices);

            const result = await controller.getAll();

            expect(currencyUseCase.getAll).toHaveBeenCalledWith();
            expect(result).toBeDefined();
        });
    });

    describe('getByCurrency', () => {
        let lengthPipe: LengthPipe;

        beforeEach(() => {
            lengthPipe = new LengthPipe();
        });

        it('should return specific currency for valid code', async () => {
            currencyUseCase.getByCurrency.mockResolvedValue(mockFiatPrice);
            const validCode = lengthPipe.transform('EUR');

            const result = await controller.getByCurrency(validCode);

            expect(currencyUseCase.getByCurrency).toHaveBeenCalledTimes(1);
            expect(currencyUseCase.getByCurrency).toHaveBeenCalledWith('EUR');
            expect(result).toEqual(mockFiatPrice);
            expect(result).toBeInstanceOf(FiatPrice);
        });

        it('should handle uppercase currency codes', async () => {
            currencyUseCase.getByCurrency.mockResolvedValue(mockFiatPrice);
            const validCode = lengthPipe.transform('EUR');

            const result = await controller.getByCurrency(validCode);

            expect(currencyUseCase.getByCurrency).toHaveBeenCalledWith('EUR');
            expect(result).toEqual(mockFiatPrice);
        });

        it('should handle lowercase currency codes', async () => {
            const lowerCasePrice = new FiatPrice(
                'eur',
                'Euro',
                0.85,
                1.0,
                'floatRates',
                '2025-08-10T12:00:00.000Z',
            );
            currencyUseCase.getByCurrency.mockResolvedValue(lowerCasePrice);
            const validCode = lengthPipe.transform('eur');

            const result = await controller.getByCurrency(validCode);

            expect(currencyUseCase.getByCurrency).toHaveBeenCalledWith('eur');
            expect(result).toEqual(lowerCasePrice);
        });

        it('should return null for non-existing currency', async () => {
            currencyUseCase.getByCurrency.mockResolvedValue(null);
            const validCode = lengthPipe.transform('XYZ');

            const result = await controller.getByCurrency(validCode);

            expect(currencyUseCase.getByCurrency).toHaveBeenCalledWith('XYZ');
            expect(result).toBeNull();
        });

        it('should propagate use case errors', async () => {
            const error = new Error('Currency not found');
            currencyUseCase.getByCurrency.mockRejectedValue(error);
            const validCode = lengthPipe.transform('EUR');

            await expect(controller.getByCurrency(validCode)).rejects.toThrow(
                'Currency not found',
            );
        });

        it('should handle various valid 3-letter codes', async () => {
            const currencies = ['USD', 'GBP', 'JPY', 'CAD', 'AUD'];

            for (const currency of currencies) {
                const mockPrice = new FiatPrice(
                    currency,
                    `${currency} Name`,
                    1.0,
                    1.0,
                    'test',
                    '2025-08-10T12:00:00.000Z',
                );
                currencyUseCase.getByCurrency.mockResolvedValueOnce(mockPrice);
                const validCode = lengthPipe.transform(currency);

                const result = await controller.getByCurrency(validCode);

                expect(result.code).toBe(currency);
            }

            expect(currencyUseCase.getByCurrency).toHaveBeenCalledTimes(
                currencies.length,
            );
        });
    });

    describe('LengthPipe integration', () => {
        let lengthPipe: LengthPipe;

        beforeEach(() => {
            lengthPipe = new LengthPipe();
        });

        it('should validate currency code length', () => {
            expect(() => lengthPipe.transform('EUR')).not.toThrow();
            expect(() => lengthPipe.transform('USD')).not.toThrow();
            expect(() => lengthPipe.transform('GBP')).not.toThrow();
        });

        it('should reject currency codes with numbers', () => {
            expect(() => lengthPipe.transform('EU1')).toThrow(BadRequestException);
            expect(() => lengthPipe.transform('U2D')).toThrow(BadRequestException);
            expect(() => lengthPipe.transform('123')).toThrow(BadRequestException);

            try {
                lengthPipe.transform('EU1');
            } catch (error) {
                expect(error).toBeInstanceOf(BadRequestException);
                expect(error.message).toBe('currency code cannot contain a number');
            }
        });

        it('should reject currency codes with wrong length', () => {
            expect(() => lengthPipe.transform('EU')).toThrow(BadRequestException);
            expect(() => lengthPipe.transform('EURO')).toThrow(BadRequestException);
            expect(() => lengthPipe.transform('')).toThrow(BadRequestException);
            expect(() => lengthPipe.transform('A')).toThrow(BadRequestException);

            try {
                lengthPipe.transform('EU');
            } catch (error) {
                expect(error).toBeInstanceOf(BadRequestException);
                expect(error.message).toBe('wrong currency code');
            }
        });

        it('should handle mixed case currency codes', () => {
            expect(() => lengthPipe.transform('eur')).not.toThrow();
            expect(() => lengthPipe.transform('Eur')).not.toThrow();
            expect(() => lengthPipe.transform('eUR')).not.toThrow();
        });

        it('should handle special characters', () => {
            expect(() => lengthPipe.transform('EU@')).not.toThrow();
            expect(() => lengthPipe.transform('E-R')).not.toThrow();
            expect(() => lengthPipe.transform('E_R')).not.toThrow();
        });

        it('should return the same value for valid codes', () => {
            expect(lengthPipe.transform('EUR')).toBe('EUR');
            expect(lengthPipe.transform('usd')).toBe('usd');
            expect(lengthPipe.transform('GbP')).toBe('GbP');
        });
    });

    describe('error handling', () => {
        it('should handle timeout errors from use case', async () => {
            const timeoutError = new Error('Request timeout');
            currencyUseCase.getByCurrency.mockRejectedValue(timeoutError);
            const lengthPipe = new LengthPipe();
            const validCode = lengthPipe.transform('EUR');

            await expect(controller.getByCurrency(validCode)).rejects.toThrow(
                'Request timeout',
            );
        });

        it('should handle service unavailable errors', async () => {
            const serviceError = new Error('Service temporarily unavailable');
            currencyUseCase.getAll.mockRejectedValue(serviceError);

            await expect(controller.getAll()).rejects.toThrow(
                'Service temporarily unavailable',
            );
        });

        it('should handle rate limiting errors', async () => {
            const rateLimitError = new Error('Rate limit exceeded');
            currencyUseCase.getByCurrency.mockRejectedValue(rateLimitError);
            const lengthPipe = new LengthPipe();
            const validCode = lengthPipe.transform('EUR');

            await expect(controller.getByCurrency(validCode)).rejects.toThrow(
                'Rate limit exceeded',
            );
        });
    });

    describe('dependency injection', () => {
        it('should inject CurrencyUseCase correctly', () => {
            expect(currencyUseCase).toBeDefined();
            expect(currencyUseCase.getByCurrency).toBeDefined();
            expect(currencyUseCase.getAll).toBeDefined();
        });

        it('should use injected use case for operations', async () => {
            currencyUseCase.getAll.mockResolvedValue(mockFiatPrices);
            currencyUseCase.getByCurrency.mockResolvedValue(mockFiatPrice);

            await controller.getAll();
            const lengthPipe = new LengthPipe();
            const validCode = lengthPipe.transform('EUR');
            await controller.getByCurrency(validCode);

            expect(currencyUseCase.getAll).toHaveBeenCalled();
            expect(currencyUseCase.getByCurrency).toHaveBeenCalled();
        });
    });

    describe('HTTP mapping', () => {
        it('should map GET /fiat/currency to getAll', () => {
            const getMetadata = Reflect.getMetadata(
                'path',
                CurrencyController.prototype.getAll,
            );
            expect(getMetadata).toBe('currency');
        });

        it('should map GET /fiat/currency/:code to getByCurrency', () => {
            const getMetadata = Reflect.getMetadata(
                'path',
                CurrencyController.prototype.getByCurrency,
            );
            expect(getMetadata).toBe('currency/:code');
        });

        it('should have correct controller path', () => {
            const controllerPath = Reflect.getMetadata('path', CurrencyController);
            expect(controllerPath).toBe('fiat');
        });
    });

    describe('performance', () => {
        it('should handle concurrent requests to getAll', async () => {
            currencyUseCase.getAll.mockResolvedValue(mockFiatPrices);

            const promises = Array(5)
                .fill(null)
                .map(() => controller.getAll());
            const results = await Promise.all(promises);

            expect(results).toHaveLength(5);
            expect(currencyUseCase.getAll).toHaveBeenCalledTimes(5);
            results.forEach((result) => {
                expect(result).toEqual(mockFiatPrices);
            });
        });

        it('should handle concurrent requests to getByCurrency', async () => {
            currencyUseCase.getByCurrency.mockResolvedValue(mockFiatPrice);
            const lengthPipe = new LengthPipe();
            const validCode = lengthPipe.transform('EUR');

            const promises = Array(3)
                .fill(null)
                .map(() => controller.getByCurrency(validCode));
            const results = await Promise.all(promises);

            expect(results).toHaveLength(3);
            expect(currencyUseCase.getByCurrency).toHaveBeenCalledTimes(3);
            results.forEach((result) => {
                expect(result).toEqual(mockFiatPrice);
            });
        });
    });
});
