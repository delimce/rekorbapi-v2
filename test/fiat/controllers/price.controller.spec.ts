/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { PriceController } from '@Fiat/infrastructure/controllers/price.controller';
import { BcvUseCase, BlueUseCase } from '@Fiat/application/prices';
import { FiatPrice } from '@Fiat/domain/dto/fiatPrice';

describe('PriceController', () => {
    let controller: PriceController;
    let bcvUseCase: jest.Mocked<BcvUseCase>;
    let blueUseCase: jest.Mocked<BlueUseCase>;

    const mockBcvPrice = new FiatPrice(
        'BCV',
        'ves',
        36.5,
        1.0,
        'BCV',
        '2025-08-10T12:00:00.000Z',
    );

    const mockBluePrice = new FiatPrice(
        'BLUE',
        'ars',
        425.5,
        1.0,
        'BLUE',
        '2025-08-10T12:00:00.000Z',
    );

    beforeEach(async () => {
        const mockBcvUseCase = {
            getPrice: jest.fn(),
        };

        const mockBlueUseCase = {
            getPrice: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            controllers: [PriceController],
            providers: [
                {
                    provide: BcvUseCase,
                    useValue: mockBcvUseCase,
                },
                {
                    provide: BlueUseCase,
                    useValue: mockBlueUseCase,
                },
            ],
        }).compile();

        controller = module.get<PriceController>(PriceController);
        bcvUseCase = module.get(BcvUseCase);
        blueUseCase = module.get(BlueUseCase);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('getPriceBcv', () => {
        it('should return BCV price', async () => {
            bcvUseCase.getPrice.mockResolvedValue(mockBcvPrice);

            const result = await controller.getPriceBcv();

            expect(bcvUseCase.getPrice).toHaveBeenCalledTimes(1);
            expect(bcvUseCase.getPrice).toHaveBeenCalledWith();
            expect(result).toEqual(mockBcvPrice);
            expect(result).toBeInstanceOf(FiatPrice);
            expect(result.code).toBe('BCV');
            expect(result.currency).toBe('ves');
            expect(result.source).toBe('BCV');
        });

        it('should handle successful BCV price retrieval with different values', async () => {
            const differentBcvPrice = new FiatPrice(
                'BCV',
                'ves',
                42.75,
                1.0,
                'BCV',
                '2025-08-10T15:30:00.000Z',
            );
            bcvUseCase.getPrice.mockResolvedValue(differentBcvPrice);

            const result = await controller.getPriceBcv();

            expect(result.price).toBe(42.75);
            expect(result.date).toBe('2025-08-10T15:30:00.000Z');
        });

        it('should handle zero BCV price', async () => {
            const zeroBcvPrice = new FiatPrice(
                'BCV',
                'ves',
                0.0,
                1.0,
                'BCV',
                '2025-08-10T12:00:00.000Z',
            );
            bcvUseCase.getPrice.mockResolvedValue(zeroBcvPrice);

            const result = await controller.getPriceBcv();

            expect(result.price).toBe(0.0);
            expect(result.code).toBe('BCV');
        });

        it('should propagate BCV use case errors', async () => {
            const error = new Error('BCV website is unavailable');
            bcvUseCase.getPrice.mockRejectedValue(error);

            await expect(controller.getPriceBcv()).rejects.toThrow(
                'BCV website is unavailable',
            );
            expect(bcvUseCase.getPrice).toHaveBeenCalledTimes(1);
        });

        it('should handle BCV timeout errors', async () => {
            const timeoutError = new Error('BCV request timeout');
            bcvUseCase.getPrice.mockRejectedValue(timeoutError);

            await expect(controller.getPriceBcv()).rejects.toThrow(
                'BCV request timeout',
            );
        });

        it('should handle BCV SSL certificate errors', async () => {
            const sslError = new Error('SSL certificate verification failed');
            bcvUseCase.getPrice.mockRejectedValue(sslError);

            await expect(controller.getPriceBcv()).rejects.toThrow(
                'SSL certificate verification failed',
            );
        });

        it('should handle BCV HTML parsing errors', async () => {
            const parseError = new Error('Cannot parse BCV website');
            bcvUseCase.getPrice.mockRejectedValue(parseError);

            await expect(controller.getPriceBcv()).rejects.toThrow(
                'Cannot parse BCV website',
            );
        });

        it('should handle BCV service returning null', async () => {
            bcvUseCase.getPrice.mockResolvedValue(null as any);

            const result = await controller.getPriceBcv();

            expect(result).toBeNull();
        });

        it('should handle multiple consecutive BCV calls', async () => {
            bcvUseCase.getPrice.mockResolvedValue(mockBcvPrice);

            const result1 = await controller.getPriceBcv();
            const result2 = await controller.getPriceBcv();

            expect(bcvUseCase.getPrice).toHaveBeenCalledTimes(2);
            expect(result1).toEqual(mockBcvPrice);
            expect(result2).toEqual(mockBcvPrice);
        });

        it('should handle high BCV price values', async () => {
            const highBcvPrice = new FiatPrice(
                'BCV',
                'ves',
                999.99,
                1.0,
                'BCV',
                '2025-08-10T12:00:00.000Z',
            );
            bcvUseCase.getPrice.mockResolvedValue(highBcvPrice);

            const result = await controller.getPriceBcv();

            expect(result.price).toBe(999.99);
        });

        it('should not require any parameters', async () => {
            bcvUseCase.getPrice.mockResolvedValue(mockBcvPrice);

            const result = await controller.getPriceBcv();

            expect(bcvUseCase.getPrice).toHaveBeenCalledWith();
            expect(result).toBeDefined();
        });
    });

    describe('getPriceBlue', () => {
        it('should return Blue dollar price', async () => {
            blueUseCase.getPrice.mockResolvedValue(mockBluePrice);

            const result = await controller.getPriceBlue();

            expect(blueUseCase.getPrice).toHaveBeenCalledTimes(1);
            expect(blueUseCase.getPrice).toHaveBeenCalledWith();
            expect(result).toEqual(mockBluePrice);
            expect(result).toBeInstanceOf(FiatPrice);
            expect(result.code).toBe('BLUE');
            expect(result.currency).toBe('ars');
            expect(result.source).toBe('BLUE');
        });

        it('should handle successful Blue price retrieval with different values', async () => {
            const differentBluePrice = new FiatPrice(
                'BLUE',
                'ars',
                500.25,
                1.0,
                'BLUE',
                '2025-08-10T16:45:00.000Z',
            );
            blueUseCase.getPrice.mockResolvedValue(differentBluePrice);

            const result = await controller.getPriceBlue();

            expect(result.price).toBe(500.25);
            expect(result.date).toBe('2025-08-10T16:45:00.000Z');
        });

        it('should handle zero Blue price', async () => {
            const zeroBluePrice = new FiatPrice(
                'BLUE',
                'ars',
                0.0,
                1.0,
                'BLUE',
                '2025-08-10T12:00:00.000Z',
            );
            blueUseCase.getPrice.mockResolvedValue(zeroBluePrice);

            const result = await controller.getPriceBlue();

            expect(result.price).toBe(0.0);
            expect(result.code).toBe('BLUE');
        });

        it('should propagate Blue use case errors', async () => {
            const error = new Error('Bluelytics API is unavailable');
            blueUseCase.getPrice.mockRejectedValue(error);

            await expect(controller.getPriceBlue()).rejects.toThrow(
                'Bluelytics API is unavailable',
            );
            expect(blueUseCase.getPrice).toHaveBeenCalledTimes(1);
        });

        it('should handle Blue API timeout errors', async () => {
            const timeoutError = new Error('Blue API timeout');
            blueUseCase.getPrice.mockRejectedValue(timeoutError);

            await expect(controller.getPriceBlue()).rejects.toThrow(
                'Blue API timeout',
            );
        });

        it('should handle Blue API rate limiting', async () => {
            const rateLimitError = new Error('Blue API rate limit exceeded');
            blueUseCase.getPrice.mockRejectedValue(rateLimitError);

            await expect(controller.getPriceBlue()).rejects.toThrow(
                'Blue API rate limit exceeded',
            );
        });

        it('should handle Blue JSON parsing errors', async () => {
            const jsonError = new Error('Invalid JSON from Blue API');
            blueUseCase.getPrice.mockRejectedValue(jsonError);

            await expect(controller.getPriceBlue()).rejects.toThrow(
                'Invalid JSON from Blue API',
            );
        });

        it('should handle Blue service returning null', async () => {
            blueUseCase.getPrice.mockResolvedValue(null as any);

            const result = await controller.getPriceBlue();

            expect(result).toBeNull();
        });

        it('should handle multiple consecutive Blue calls', async () => {
            blueUseCase.getPrice.mockResolvedValue(mockBluePrice);

            const result1 = await controller.getPriceBlue();
            const result2 = await controller.getPriceBlue();

            expect(blueUseCase.getPrice).toHaveBeenCalledTimes(2);
            expect(result1).toEqual(mockBluePrice);
            expect(result2).toEqual(mockBluePrice);
        });

        it('should handle high Blue price values (hyperinflation)', async () => {
            const hyperInflationPrice = new FiatPrice(
                'BLUE',
                'ars',
                10000.0,
                1.0,
                'BLUE',
                '2025-08-10T12:00:00.000Z',
            );
            blueUseCase.getPrice.mockResolvedValue(hyperInflationPrice);

            const result = await controller.getPriceBlue();

            expect(result.price).toBe(10000.0);
        });

        it('should not require any parameters', async () => {
            blueUseCase.getPrice.mockResolvedValue(mockBluePrice);

            const result = await controller.getPriceBlue();

            expect(blueUseCase.getPrice).toHaveBeenCalledWith();
            expect(result).toBeDefined();
        });
    });

    describe('dependency injection', () => {
        it('should inject both use cases correctly', () => {
            expect(bcvUseCase).toBeDefined();
            expect(blueUseCase).toBeDefined();
            expect(bcvUseCase.getPrice).toBeDefined();
            expect(blueUseCase.getPrice).toBeDefined();
        });

        it('should use injected use cases for operations', async () => {
            bcvUseCase.getPrice.mockResolvedValue(mockBcvPrice);
            blueUseCase.getPrice.mockResolvedValue(mockBluePrice);

            await controller.getPriceBcv();
            await controller.getPriceBlue();

            expect(bcvUseCase.getPrice).toHaveBeenCalled();
            expect(blueUseCase.getPrice).toHaveBeenCalled();
        });

        it('should maintain separate instances for each use case', () => {
            expect(bcvUseCase).not.toBe(blueUseCase);
        });
    });

    describe('HTTP mapping', () => {
        it('should map GET /fiat/bcv to getPriceBcv', () => {
            const getMetadata = Reflect.getMetadata(
                'path',
                PriceController.prototype.getPriceBcv,
            );
            expect(getMetadata).toBe('bcv');
        });

        it('should map GET /fiat/blue to getPriceBlue', () => {
            const getMetadata = Reflect.getMetadata(
                'path',
                PriceController.prototype.getPriceBlue,
            );
            expect(getMetadata).toBe('blue');
        });

        it('should have correct controller path', () => {
            const controllerPath = Reflect.getMetadata('path', PriceController);
            expect(controllerPath).toBe('fiat');
        });
    });

    describe('error handling', () => {
        it('should handle network errors for BCV', async () => {
            const networkError = new Error('Network connection failed');
            bcvUseCase.getPrice.mockRejectedValue(networkError);

            await expect(controller.getPriceBcv()).rejects.toThrow(
                'Network connection failed',
            );
        });

        it('should handle network errors for Blue', async () => {
            const networkError = new Error('Blue API network error');
            blueUseCase.getPrice.mockRejectedValue(networkError);

            await expect(controller.getPriceBlue()).rejects.toThrow(
                'Blue API network error',
            );
        });

        it('should handle service unavailable for both endpoints', async () => {
            const serviceError = new Error('Service temporarily unavailable');
            bcvUseCase.getPrice.mockRejectedValue(serviceError);
            blueUseCase.getPrice.mockRejectedValue(serviceError);

            await expect(controller.getPriceBcv()).rejects.toThrow(
                'Service temporarily unavailable',
            );
            await expect(controller.getPriceBlue()).rejects.toThrow(
                'Service temporarily unavailable',
            );
        });

        it('should handle one service failing while other succeeds', async () => {
            bcvUseCase.getPrice.mockRejectedValue(new Error('BCV failed'));
            blueUseCase.getPrice.mockResolvedValue(mockBluePrice);

            await expect(controller.getPriceBcv()).rejects.toThrow('BCV failed');

            const blueResult = await controller.getPriceBlue();
            expect(blueResult).toEqual(mockBluePrice);
        });
    });

    describe('performance', () => {
        it('should handle concurrent requests to BCV', async () => {
            bcvUseCase.getPrice.mockResolvedValue(mockBcvPrice);

            const promises = Array(3)
                .fill(null)
                .map(() => controller.getPriceBcv());
            const results = await Promise.all(promises);

            expect(results).toHaveLength(3);
            expect(bcvUseCase.getPrice).toHaveBeenCalledTimes(3);
            results.forEach((result) => {
                expect(result).toEqual(mockBcvPrice);
            });
        });

        it('should handle concurrent requests to Blue', async () => {
            blueUseCase.getPrice.mockResolvedValue(mockBluePrice);

            const promises = Array(3)
                .fill(null)
                .map(() => controller.getPriceBlue());
            const results = await Promise.all(promises);

            expect(results).toHaveLength(3);
            expect(blueUseCase.getPrice).toHaveBeenCalledTimes(3);
            results.forEach((result) => {
                expect(result).toEqual(mockBluePrice);
            });
        });

        it('should handle concurrent requests to both endpoints', async () => {
            bcvUseCase.getPrice.mockResolvedValue(mockBcvPrice);
            blueUseCase.getPrice.mockResolvedValue(mockBluePrice);

            const bcvPromises = Array(2)
                .fill(null)
                .map(() => controller.getPriceBcv());
            const bluePromises = Array(2)
                .fill(null)
                .map(() => controller.getPriceBlue());

            const allResults = await Promise.all([...bcvPromises, ...bluePromises]);

            expect(allResults).toHaveLength(4);
            expect(bcvUseCase.getPrice).toHaveBeenCalledTimes(2);
            expect(blueUseCase.getPrice).toHaveBeenCalledTimes(2);
        });
    });

    describe('integration scenarios', () => {
        it('should handle mixed success and failure scenarios', async () => {
            bcvUseCase.getPrice.mockResolvedValue(mockBcvPrice);
            blueUseCase.getPrice.mockRejectedValue(new Error('Blue API down'));

            const bcvResult = await controller.getPriceBcv();
            expect(bcvResult).toEqual(mockBcvPrice);

            await expect(controller.getPriceBlue()).rejects.toThrow('Blue API down');
        });

        it('should handle service recovery', async () => {
            // First call fails
            bcvUseCase.getPrice.mockRejectedValueOnce(
                new Error('Temporary BCV failure'),
            );
            // Second call succeeds
            bcvUseCase.getPrice.mockResolvedValueOnce(mockBcvPrice);

            await expect(controller.getPriceBcv()).rejects.toThrow(
                'Temporary BCV failure',
            );

            const result = await controller.getPriceBcv();
            expect(result).toEqual(mockBcvPrice);
        });

        it('should maintain independent state between endpoints', async () => {
            bcvUseCase.getPrice.mockResolvedValue(mockBcvPrice);
            blueUseCase.getPrice.mockResolvedValue(mockBluePrice);

            const bcvResult = await controller.getPriceBcv();
            const blueResult = await controller.getPriceBlue();

            expect(bcvResult).not.toEqual(blueResult);
            expect(bcvResult.code).toBe('BCV');
            expect(blueResult.code).toBe('BLUE');
            expect(bcvResult.currency).toBe('ves');
            expect(blueResult.currency).toBe('ars');
        });
    });

    describe('market scenarios', () => {
        it('should handle typical BCV price ranges', async () => {
            const typicalBcvPrices = [30.5, 35.0, 40.25, 45.75, 50.0];

            for (const price of typicalBcvPrices) {
                const bcvPrice = new FiatPrice(
                    'BCV',
                    'ves',
                    price,
                    1.0,
                    'BCV',
                    '2025-08-10T12:00:00.000Z',
                );
                bcvUseCase.getPrice.mockResolvedValueOnce(bcvPrice);

                const result = await controller.getPriceBcv();
                expect(result.price).toBe(price);
            }
        });

        it('should handle typical Blue dollar price ranges', async () => {
            const typicalBluePrices = [300, 400, 500, 600, 700];

            for (const price of typicalBluePrices) {
                const bluePrice = new FiatPrice(
                    'BLUE',
                    'ars',
                    price,
                    1.0,
                    'BLUE',
                    '2025-08-10T12:00:00.000Z',
                );
                blueUseCase.getPrice.mockResolvedValueOnce(bluePrice);

                const result = await controller.getPriceBlue();
                expect(result.price).toBe(price);
            }
        });
    });
});
