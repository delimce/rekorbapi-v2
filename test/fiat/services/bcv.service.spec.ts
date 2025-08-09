/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { of, throwError } from 'rxjs';
import { AxiosResponse } from 'axios';
import { Agent } from 'https';
import BcvService from '@Fiat/infrastructure/services/bcv.service';
import { FiatPrice } from '@Fiat/domain/dto/fiatPrice';


describe('BcvService', () => {
    let service: BcvService;
    let httpService: HttpService;

    const mockBcvHtml = `
    <html>
      <body>
        <div id="dolar">
          <div>
            <div>
              <strong>36,50 Bs</strong>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;

    const mockAxiosResponse: AxiosResponse = {
        data: mockBcvHtml,
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
            httpsAgent: null as Agent | null,
        },
    };

    beforeEach(async () => {
        const mockHttpService = {
            get: jest.fn(),
            axiosRef: mockAxiosRef,
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                BcvService,
                {
                    provide: HttpService,
                    useValue: mockHttpService,
                },
            ],
        }).compile();

        service = module.get<BcvService>(BcvService);
        httpService = module.get<HttpService>(HttpService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should have correct code and currency properties', () => {
        expect(service.code).toBe('BCV');
        expect(service.currency).toBe('ves');
    });

    describe('getPrice', () => {
        it('should return BCV dollar price from HTML', async () => {
            jest.spyOn(httpService, 'get').mockReturnValue(of(mockAxiosResponse));

            const price = await service.getPrice();

            expect(httpService.get).toHaveBeenCalledWith('https://www.bcv.org.ve');
            expect(httpService.axiosRef.defaults.timeout).toBe(8000);
            expect(httpService.axiosRef.defaults.httpsAgent).toBeInstanceOf(Agent);
            expect(price).toBe(36.5);
        });

        it('should handle price with thousands separator', async () => {
            const htmlWithThousands = `
        <html>
          <body>
            <div id="dolar">
              <div>
                <div>
                  <strong>1.234,56 Bs</strong>
                </div>
              </div>
            </div>
          </body>
        </html>
      `;
            const responseWithThousands = {
                ...mockAxiosResponse,
                data: htmlWithThousands,
            };
            jest.spyOn(httpService, 'get').mockReturnValue(of(responseWithThousands));

            const price = await service.getPrice();

            expect(price).toBe(1234.56);
        });

        it('should handle price without decimal places', async () => {
            const htmlWithoutDecimals = `
        <html>
          <body>
            <div id="dolar">
              <div>
                <div>
                  <strong>45 Bs</strong>
                </div>
              </div>
            </div>
          </body>
        </html>
      `;
            const responseWithoutDecimals = {
                ...mockAxiosResponse,
                data: htmlWithoutDecimals,
            };
            jest
                .spyOn(httpService, 'get')
                .mockReturnValue(of(responseWithoutDecimals));

            const price = await service.getPrice();

            expect(price).toBe(45);
        });


        it('should handle HTTP errors gracefully', async () => {
            jest
                .spyOn(httpService, 'get')
                .mockReturnValue(throwError(() => new Error('SSL certificate error')));

            await expect(service.getPrice()).rejects.toThrow('SSL certificate error');
        });

        it('should set correct timeout and HTTPS agent configuration', async () => {
            jest.spyOn(httpService, 'get').mockReturnValue(of(mockAxiosResponse));

            await service.getPrice();

            expect(httpService.axiosRef.defaults.timeout).toBe(8000);
            expect(httpService.axiosRef.defaults.httpsAgent).toBeInstanceOf(Agent);
        });

        it('should configure HTTPS agent to not reject unauthorized certificates', async () => {
            jest.spyOn(httpService, 'get').mockReturnValue(of(mockAxiosResponse));

            await service.getPrice();

            const agent = httpService.axiosRef.defaults.httpsAgent as Agent;
            expect((agent as any).options.rejectUnauthorized).toBe(false);
        });
    });

    describe('formatPrice (private method)', () => {
        it('should format price with comma as decimal separator', async () => {
            const htmlWithCommaDecimal = `
        <html>
          <body>
            <div id="dolar">
              <div>
                <div>
                  <strong>42,75 Bs</strong>
                </div>
              </div>
            </div>
          </body>
        </html>
      `;
            const response = { ...mockAxiosResponse, data: htmlWithCommaDecimal };
            jest.spyOn(httpService, 'get').mockReturnValue(of(response));

            const price = await service.getPrice();

            expect(price).toBe(42.75);
        });

        it('should format price with dots as thousands separator', async () => {
            const htmlWithDotsThousands = `
        <html>
          <body>
            <div id="dolar">
              <div>
                <div>
                  <strong>1.000.234,89 Bs</strong>
                </div>
              </div>
            </div>
          </body>
        </html>
      `;
            const response = { ...mockAxiosResponse, data: htmlWithDotsThousands };
            jest.spyOn(httpService, 'get').mockReturnValue(of(response));

            const price = await service.getPrice();

            expect(price).toBe(1000234.89);
        });
    });

    describe('getFiatPrice', () => {
        it('should return FiatPrice with correct properties', async () => {
            jest.spyOn(httpService, 'get').mockReturnValue(of(mockAxiosResponse));

            const fiatPrice = await service.getFiatPrice();

            expect(fiatPrice).toBeInstanceOf(FiatPrice);
            expect(fiatPrice.code).toBe('BCV');
            expect(fiatPrice.currency).toBe('ves');
            expect(fiatPrice.price).toBe(36.5);
            expect(fiatPrice.price_usd).toBe(1.0);
            expect(fiatPrice.source).toBe('BCV');
            expect(fiatPrice.date).toMatch(
                /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/,
            );
        });

        it('should handle price retrieval errors', async () => {
            jest
                .spyOn(httpService, 'get')
                .mockReturnValue(throwError(() => new Error('Website unavailable')));

            await expect(service.getFiatPrice()).rejects.toThrow(
                'Website unavailable',
            );
        });
    });

    describe('inheritance from PriceServiceAbstract', () => {
        it('should inherit getFiatPrice method functionality', async () => {
            jest.spyOn(service, 'getPrice').mockResolvedValue(50.25);

            const result = await service.getFiatPrice();

            expect(result).toBeInstanceOf(FiatPrice);
            expect(result.price).toBe(50.25);
            expect(result.code).toBe(service.code);
            expect(result.currency).toBe(service.currency);
            expect(result.source).toBe(service.code);
        });

        it('should use service properties in FiatPrice creation', async () => {
            jest.spyOn(service, 'getPrice').mockResolvedValue(789.12);

            const result = await service.getFiatPrice();

            expect(result.code).toBe('BCV');
            expect(result.currency).toBe('ves');
            expect(result.source).toBe('BCV');
            expect(result.price_usd).toBe(1.0);
        });
    });
});
