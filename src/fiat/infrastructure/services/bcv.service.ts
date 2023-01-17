import { Injectable } from '@nestjs/common';

import { PriceServiceInterface } from 'src/fiat/domain/interfaces/priceService.interface';
import PriceServiceAbstract from './priceService.abstract';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { load } from 'cheerio';
import { Agent } from 'https';

const url = 'https://www.bcv.org.ve';

@Injectable()
class BcvService extends PriceServiceAbstract implements PriceServiceInterface {
  constructor(private httpService: HttpService) {
    super();
  }
  code = 'BCV';
  currency = 'ves';
  async getPrice(): Promise<number> {
    this.httpService.axiosRef.defaults.timeout = 8000;
    this.httpService.axiosRef.defaults.httpsAgent = new Agent({
      rejectUnauthorized: false,
    });
    const response = await firstValueFrom(this.httpService.get(url));
    const $ = load(response.data);
    const content = $('#dolar').children().last().find('strong').text().trim();
    return this.formatPrice(content);
  }

  private formatPrice(price: string): number {
    const bcvPrice = price.split(' '); //money reconvert bcvPrice[1]
    return Number(bcvPrice[0].replace(/\./g, '').replace(',', '.'));
  }
}

export default BcvService;
