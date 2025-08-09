/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { of, throwError } from 'rxjs';
import { AxiosResponse } from 'axios';
import BlueService from '@Fiat/infrastructure/services/blue.service';
import { FiatPrice } from '@Fiat/domain/dto/fiatPrice';

describe('BlueService', () => {
    let service: BlueService;
    let httpService: HttpService;

    const mockBlueResponse = {
        blue: {
            value_buy: 425.5,
            value_sell: 435.75,
        },
        oficial: {
            value_buy: 350.25,
            value_sell: 365.8,
        },
    };

    const mockAxiosResponse: AxiosResponse = {
        data: mockBlueResponse,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
            headers: {} as any,
        },
    };

    const mockAxiosRef = {
        defaults: {
            timeout: 0,
        },
    };

    beforeEach(async () => {
        const mockHttpService = {
            get: jest.fn(),
            axiosRef: mockAxiosRef,
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                BlueService,
                {
                    provide: HttpService,
                    useValue: mockHttpService,
                },
            ],
        }).compile();

        service = module.get<BlueService>(BlueService);
        httpService = module.get<HttpService>(HttpService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should have correct code and currency properties', () => {
        expect(service.code).toBe('BLUE');
        expect(service.currency).toBe('ars');
    });

    describe('getPrice', () => {
        it('should return blue dollar price', async () => {
            jest.spyOn(httpService, 'get').mockReturnValue(of(mockAxiosResponse));

            const price = await service.getPrice();

            expect(httpService.get).toHaveBeenCalledWith(
                'https://api.bluelytics.com.ar/v2/latest',
            );
            expect(httpService.axiosRef.defaults.timeout).toBe(4000);
            expect(price).toBe(425.5);
        });

        it('should return 0 if value_buy is not available', async () => {
            const responseWithoutValue = {
                ...mockAxiosResponse,
                data: {
                    blue: {
                        value_sell: 435.75,
                    },
                },
            };
            jest.spyOn(httpService, 'get').mockReturnValue(of(responseWithoutValue));

            const price = await service.getPrice();

            expect(price).toBe(0.0);
        });

        it('should handle HTTP errors gracefully', async () => {
            jest
                .spyOn(httpService, 'get')
                .mockReturnValue(throwError(() => new Error('Network timeout')));

            await expect(service.getPrice()).rejects.toThrow('Network timeout');
        });

        it('should handle malformed response data', async () => {
            const malformedResponse = {
                ...mockAxiosResponse,
                data: null,
            };
            jest.spyOn(httpService, 'get').mockReturnValue(of(malformedResponse));

            await expect(service.getPrice()).rejects.toThrow();
        });

        it('should set correct timeout configuration', async () => {
            jest.spyOn(httpService, 'get').mockReturnValue(of(mockAxiosResponse));

            await service.getPrice();

            expect(httpService.axiosRef.defaults.timeout).toBe(4000);
        });
    });

    describe('getFiatPrice', () => {
        it('should return FiatPrice with correct properties', async () => {
            jest.spyOn(httpService, 'get').mockReturnValue(of(mockAxiosResponse));

            const fiatPrice = await service.getFiatPrice();

            expect(fiatPrice).toBeInstanceOf(FiatPrice);
            expect(fiatPrice.code).toBe('BLUE');
            expect(fiatPrice.currency).toBe('ars');
            expect(fiatPrice.price).toBe(425.5);
            expect(fiatPrice.price_usd).toBe(1.0);
            expect(fiatPrice.source).toBe('BLUE');
            expect(fiatPrice.date).toMatch(
                /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/,
            );
        });

        it('should handle price retrieval errors', async () => {
            jest
                .spyOn(httpService, 'get')
                .mockReturnValue(throwError(() => new Error('API unavailable')));

            await expect(service.getFiatPrice()).rejects.toThrow('API unavailable');
        });

        it('should return FiatPrice with 0 price when value_buy is missing', async () => {
            const responseWithoutValue = {
                ...mockAxiosResponse,
                data: {
                    blue: {},
                },
            };
            jest.spyOn(httpService, 'get').mockReturnValue(of(responseWithoutValue));

            const fiatPrice = await service.getFiatPrice();

            expect(fiatPrice.price).toBe(0.0);
            expect(fiatPrice.code).toBe('BLUE');
            expect(fiatPrice.currency).toBe('ars');
        });
    });

    describe('inheritance from PriceServiceAbstract', () => {
        it('should inherit getFiatPrice method functionality', async () => {
            jest.spyOn(service, 'getPrice').mockResolvedValue(500.25);

            const result = await service.getFiatPrice();

            expect(result).toBeInstanceOf(FiatPrice);
            expect(result.price).toBe(500.25);
            expect(result.code).toBe(service.code);
            expect(result.currency).toBe(service.currency);
            expect(result.source).toBe(service.code);
        });

        it('should use service properties in FiatPrice creation', async () => {
            jest.spyOn(service, 'getPrice').mockResolvedValue(123.45);

            const result = await service.getFiatPrice();

            expect(result.code).toBe('BLUE');
            expect(result.currency).toBe('ars');
            expect(result.source).toBe('BLUE');
            expect(result.price_usd).toBe(1.0);
        });
    });
});
