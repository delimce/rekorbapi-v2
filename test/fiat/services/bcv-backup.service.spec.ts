/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import BcvBackupService from '@Fiat/infrastructure/services/bcv-backup.service';
import { FiatPrice } from '@Fiat/domain/dto/fiatPrice';

describe('BcvBackupService', () => {
    let service: BcvBackupService;

    const mockApiResponse = [
        {
            id: 1,
            type: 'bolivar',
            slug: 'dolar-bcv',
            name: 'Dolar BCV',
            price: 36.5,
        },
        {
            id: 2,
            type: 'bolivar',
            slug: 'euro-bcv',
            name: 'Euro BCV',
            price: 42.8,
        },
        {
            id: 3,
            type: 'crypto',
            slug: 'bitcoin',
            name: 'Bitcoin',
            price: 45000,
        },
    ];

    const mockAxiosRef = {
        get: jest.fn(),
    };

    beforeEach(async () => {
        const mockHttpService = {
            axiosRef: mockAxiosRef,
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                BcvBackupService,
                {
                    provide: HttpService,
                    useValue: mockHttpService,
                },
            ],
        }).compile();

        service = module.get<BcvBackupService>(BcvBackupService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should have correct code and currency properties', () => {
        expect(service.code).toBe('BCV_BACKUP');
        expect(service.currency).toBe('ves');
    });

    describe('getPrice', () => {
        it('should return BCV dollar price from API', async () => {
            mockAxiosRef.get.mockResolvedValue({ data: mockApiResponse });

            const price = await service.getPrice();

            expect(mockAxiosRef.get).toHaveBeenCalledWith(
                'https://exchange.vcoud.com/coins/latest',
                { timeout: 6000 },
            );
            expect(price).toBe(36.5);
        });

        it('should handle API response with data wrapper', async () => {
            const wrappedResponse = { data: mockApiResponse };
            mockAxiosRef.get.mockResolvedValue({ data: wrappedResponse });

            const price = await service.getPrice();

            expect(price).toBe(36.5);
        });

        it('should return 0 when target coin is not found', async () => {
            const responseWithoutBcv = [
                {
                    id: 1,
                    type: 'crypto',
                    slug: 'bitcoin',
                    name: 'Bitcoin',
                    price: 45000,
                },
                {
                    id: 2,
                    type: 'bolivar',
                    slug: 'euro-bcv',
                    name: 'Euro BCV',
                    price: 42.8,
                },
            ];
            mockAxiosRef.get.mockResolvedValue({ data: responseWithoutBcv });

            const price = await service.getPrice();

            expect(price).toBe(0.0);
        });

        it('should return 0 when price is missing from target coin', async () => {
            const responseWithoutPrice = [
                {
                    id: 1,
                    type: 'bolivar',
                    slug: 'dolar-bcv',
                    name: 'Dolar BCV',
                },
            ];
            mockAxiosRef.get.mockResolvedValue({ data: responseWithoutPrice });

            const price = await service.getPrice();

            expect(price).toBe(0.0);
        });

        it('should handle API errors gracefully', async () => {
            mockAxiosRef.get.mockRejectedValue(new Error('Network error'));

            const price = await service.getPrice();

            expect(price).toBe(0.0);
        });

        it('should handle timeout errors', async () => {
            mockAxiosRef.get.mockRejectedValue(new Error('timeout'));

            const price = await service.getPrice();

            expect(price).toBe(0.0);
        });

        it('should handle empty API response', async () => {
            mockAxiosRef.get.mockResolvedValue({ data: [] });

            const price = await service.getPrice();

            expect(price).toBe(0.0);
        });

        it('should handle null API response', async () => {
            mockAxiosRef.get.mockResolvedValue({ data: null });

            const price = await service.getPrice();

            expect(price).toBe(0.0);
        });

        it('should handle undefined API response', async () => {
            mockAxiosRef.get.mockResolvedValue({ data: undefined });

            const price = await service.getPrice();

            expect(price).toBe(0.0);
        });

        it('should handle non-array API response', async () => {
            mockAxiosRef.get.mockResolvedValue({ data: 'invalid' });

            const price = await service.getPrice();

            expect(price).toBe(0.0);
        });

        it('should convert price to number when it is string', async () => {
            const responseWithStringPrice = [
                {
                    id: 1,
                    type: 'bolivar',
                    slug: 'dolar-bcv',
                    name: 'Dolar BCV',
                    price: '38.75',
                },
            ];
            mockAxiosRef.get.mockResolvedValue({ data: responseWithStringPrice });

            const price = await service.getPrice();

            expect(price).toBe(38.75);
        });
    });

    describe('toList (private method)', () => {
        it('should return array when payload is array', async () => {
            mockAxiosRef.get.mockResolvedValue({ data: mockApiResponse });

            const price = await service.getPrice();

            expect(price).toBe(36.5);
        });

        it('should extract data property when payload has data wrapper', async () => {
            const wrappedData = { data: mockApiResponse };
            mockAxiosRef.get.mockResolvedValue({ data: wrappedData });

            const price = await service.getPrice();

            expect(price).toBe(36.5);
        });

        it('should return empty array when payload is invalid', async () => {
            mockAxiosRef.get.mockResolvedValue({ data: 'invalid' });

            const price = await service.getPrice();

            expect(price).toBe(0.0);
        });
    });

    describe('isTargetCoin (private method)', () => {
        it('should identify correct target coin', async () => {
            const correctCoin = {
                type: 'bolivar',
                slug: 'dolar-bcv',
                price: 36.5,
            };
            mockAxiosRef.get.mockResolvedValue({ data: [correctCoin] });

            const price = await service.getPrice();

            expect(price).toBe(36.5);
        });

        it('should handle case insensitive matching', async () => {
            const upperCaseCoin = {
                type: 'BOLIVAR',
                slug: 'DOLAR-BCV',
                price: 36.5,
            };
            mockAxiosRef.get.mockResolvedValue({ data: [upperCaseCoin] });

            const price = await service.getPrice();

            expect(price).toBe(36.5);
        });

        it('should handle missing type property', async () => {
            const coinWithoutType = {
                slug: 'dolar-bcv',
                price: 36.5,
            };
            mockAxiosRef.get.mockResolvedValue({ data: [coinWithoutType] });

            const price = await service.getPrice();

            expect(price).toBe(0.0);
        });

        it('should handle missing slug property', async () => {
            const coinWithoutSlug = {
                type: 'bolivar',
                price: 36.5,
            };
            mockAxiosRef.get.mockResolvedValue({ data: [coinWithoutSlug] });

            const price = await service.getPrice();

            expect(price).toBe(0.0);
        });

        it('should reject incorrect type', async () => {
            const wrongTypeCoin = {
                type: 'crypto',
                slug: 'dolar-bcv',
                price: 36.5,
            };
            mockAxiosRef.get.mockResolvedValue({ data: [wrongTypeCoin] });

            const price = await service.getPrice();

            expect(price).toBe(0.0);
        });

        it('should reject incorrect slug', async () => {
            const wrongSlugCoin = {
                type: 'bolivar',
                slug: 'euro-bcv',
                price: 36.5,
            };
            mockAxiosRef.get.mockResolvedValue({ data: [wrongSlugCoin] });

            const price = await service.getPrice();

            expect(price).toBe(0.0);
        });
    });

    describe('getFiatPrice', () => {
        it('should return FiatPrice with correct properties', async () => {
            mockAxiosRef.get.mockResolvedValue({ data: mockApiResponse });

            const fiatPrice = await service.getFiatPrice();

            expect(fiatPrice).toBeInstanceOf(FiatPrice);
            expect(fiatPrice.code).toBe('BCV_BACKUP');
            expect(fiatPrice.currency).toBe('ves');
            expect(fiatPrice.price).toBe(36.5);
            expect(fiatPrice.price_usd).toBe(1.0);
            expect(fiatPrice.source).toBe('BCV_BACKUP');
            expect(fiatPrice.date).toMatch(
                /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/,
            );
        });

        it('should return FiatPrice with 0 price when API fails', async () => {
            mockAxiosRef.get.mockRejectedValue(new Error('API error'));

            const fiatPrice = await service.getFiatPrice();

            expect(fiatPrice.price).toBe(0.0);
            expect(fiatPrice.code).toBe('BCV_BACKUP');
            expect(fiatPrice.currency).toBe('ves');
        });
    });

    describe('inheritance from PriceServiceAbstract', () => {
        it('should inherit getFiatPrice method functionality', async () => {
            jest.spyOn(service, 'getPrice').mockResolvedValue(45.25);

            const result = await service.getFiatPrice();

            expect(result).toBeInstanceOf(FiatPrice);
            expect(result.price).toBe(45.25);
            expect(result.code).toBe(service.code);
            expect(result.currency).toBe(service.currency);
            expect(result.source).toBe(service.code);
        });

        it('should use service properties in FiatPrice creation', async () => {
            jest.spyOn(service, 'getPrice').mockResolvedValue(123.45);

            const result = await service.getFiatPrice();

            expect(result.code).toBe('BCV_BACKUP');
            expect(result.currency).toBe('ves');
            expect(result.source).toBe('BCV_BACKUP');
            expect(result.price_usd).toBe(1.0);
        });
    });
});
