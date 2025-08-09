/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { of, throwError } from 'rxjs';
import { AxiosResponse } from 'axios';
import FloatRatesService from '@Fiat/infrastructure/services/floatRates.service';
import { FiatPrice } from '@Fiat/domain/dto/fiatPrice';

describe('FloatRatesService', () => {
    let service: FloatRatesService;
    let httpService: HttpService;

    const mockFloatRatesResponse = {
        eur: {
            alphaCode: 'EUR',
            name: 'Euro',
            rate: 0.85,
        },
        gbp: {
            alphaCode: 'GBP',
            name: 'British Pound Sterling',
            rate: 0.75,
        },
        jpy: {
            alphaCode: 'JPY',
            name: 'Japanese Yen',
            rate: 110.0,
        },
    };

    const mockAxiosResponse: AxiosResponse = {
        data: mockFloatRatesResponse,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
            headers: {} as any,
        },
    };

    beforeEach(async () => {
        const mockHttpService = {
            get: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                FloatRatesService,
                {
                    provide: HttpService,
                    useValue: mockHttpService,
                },
            ],
        }).compile();

        service = module.get<FloatRatesService>(FloatRatesService);
        httpService = module.get<HttpService>(HttpService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('toFiatPrice', () => {
        it('should convert raw data to FiatPrice', () => {
            const rawData = {
                alphaCode: 'EUR',
                name: 'Euro',
                rate: 0.85,
            };

            const result = service.toFiatPrice(rawData);

            expect(result).toBeInstanceOf(FiatPrice);
            expect(result.code).toBe('EUR');
            expect(result.currency).toBe('Euro');
            expect(result.price).toBe(0.85);
            expect(result.price_usd).toBe(1.0);
            expect(result.source).toBe('floatRates');
            expect(result.date).toMatch(
                /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/,
            );
        });

        it('should handle missing fields gracefully', () => {
            const rawData = {
                alphaCode: 'TEST',
                name: undefined,
                rate: null,
            };

            const result = service.toFiatPrice(rawData);

            expect(result.code).toBe('TEST');
            expect(result.currency).toBeUndefined();
            expect(result.price).toBeNull();
        });
    });

    describe('getByCurrency', () => {
        it('should return FiatPrice for existing currency', async () => {
            jest.spyOn(httpService, 'get').mockReturnValue(of(mockAxiosResponse));

            const result = await service.getByCurrency('EUR');

            expect(httpService.get).toHaveBeenCalledWith(
                'https://floatrates.com/daily/usd.json',
            );
            expect(result).toBeInstanceOf(FiatPrice);
            expect(result!.code).toBe('EUR');
            expect(result!.currency).toBe('Euro');
            expect(result!.price).toBe(0.85);
        });

        it('should handle case insensitive currency lookup', async () => {
            jest.spyOn(httpService, 'get').mockReturnValue(of(mockAxiosResponse));

            const result = await service.getByCurrency('eur');

            expect(result).toBeInstanceOf(FiatPrice);
            expect(result!.code).toBe('EUR');
        });

        it('should return null for non-existing currency', async () => {
            jest.spyOn(httpService, 'get').mockReturnValue(of(mockAxiosResponse));

            const result = await service.getByCurrency('NONEXISTENT');

            expect(result).toBeNull();
        });

        it('should handle HTTP errors gracefully', async () => {
            jest
                .spyOn(httpService, 'get')
                .mockReturnValue(throwError(() => new Error('Network error')));

            await expect(service.getByCurrency('EUR')).rejects.toThrow(
                'Network error',
            );
        });

        it('should handle empty response data', async () => {
            const emptyResponse = { ...mockAxiosResponse, data: {} };
            jest.spyOn(httpService, 'get').mockReturnValue(of(emptyResponse));

            const result = await service.getByCurrency('EUR');

            expect(result).toBeNull();
        });
    });

    describe('getAll', () => {
        it('should return all currencies as FiatPrice array', async () => {
            jest.spyOn(httpService, 'get').mockReturnValue(of(mockAxiosResponse));

            const result = await service.getAll();

            expect(httpService.get).toHaveBeenCalledWith(
                'https://floatrates.com/daily/usd.json',
            );
            expect(result).toHaveLength(3);
            expect(result[0]).toBeInstanceOf(FiatPrice);
            expect(result.map((fp) => fp.code)).toContain('EUR');
            expect(result.map((fp) => fp.code)).toContain('GBP');
            expect(result.map((fp) => fp.code)).toContain('JPY');
        });

        it('should handle empty response data', async () => {
            const emptyResponse = { ...mockAxiosResponse, data: {} };
            jest.spyOn(httpService, 'get').mockReturnValue(of(emptyResponse));

            const result = await service.getAll();

            expect(result).toHaveLength(0);
        });

        it('should handle undefined values in response', async () => {
            const responseWithUndefined = {
                ...mockAxiosResponse,
                data: {
                    eur: mockFloatRatesResponse.eur,
                    invalid: undefined,
                    gbp: mockFloatRatesResponse.gbp,
                },
            };
            jest.spyOn(httpService, 'get').mockReturnValue(of(responseWithUndefined));

            const result = await service.getAll();

            expect(result).toHaveLength(3);
            expect(result.filter((fp) => fp !== null)).toHaveLength(2);
            expect(result.includes(null)).toBe(true);
        });

        it('should handle HTTP errors', async () => {
            jest
                .spyOn(httpService, 'get')
                .mockReturnValue(throwError(() => new Error('Service unavailable')));

            await expect(service.getAll()).rejects.toThrow('Service unavailable');
        });
    });
});
