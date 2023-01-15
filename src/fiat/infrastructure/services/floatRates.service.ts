import { FiatPrice } from 'src/fiat/domain/dto/fiatPrice';
import { CurrencyServiceInterface } from 'src/fiat/domain/interfaces/currencyService.interface';

import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

// floatRates url
const url = 'https://floatrates.com/daily/usd.json';

@Injectable()
class FloatRatesService implements CurrencyServiceInterface {
  constructor(private httpService: HttpService) {}

  toFiatPrice(data: any): FiatPrice {
    return new FiatPrice(
      data.alphaCode,
      data.name,
      data.rate,
      1.0,
      'floatRates',
      new Date().toISOString(),
    );
  }

  async getByCurrency(currency: string): Promise<FiatPrice | null> {
    const response = await firstValueFrom(this.httpService.get(url));
    const founded =
      response.data[currency.toLocaleLowerCase()] === undefined
        ? null
        : this.toFiatPrice(response.data[currency.toLocaleLowerCase()]);
    return founded;
  }
  async getAll(): Promise<FiatPrice[]> {
    const response = await firstValueFrom(this.httpService.get(url));
    const currencies = [];
    const fiats = response.data;
    for (const code of Object.keys(fiats)) {
      const temp =
        fiats[code] != undefined ? this.toFiatPrice(fiats[code]) : null;
      currencies.push(temp);
    }
    return currencies;
  }
}

export default FloatRatesService;
