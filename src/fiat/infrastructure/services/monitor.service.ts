import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { PriceServiceInterface } from 'src/fiat/domain/interfaces/priceService.interface';
import { load } from 'cheerio';
import PriceServiceAbstract from './priceService.abstract';

// monitor url
const url = 'https://monitordolarvenezuela.com/historial';

@Injectable()
class MonitorService
  extends PriceServiceAbstract
  implements PriceServiceInterface
{
  constructor(private httpService: HttpService) {
    super();
  }
  code = 'MONITOR';

  async getPrice(): Promise<number> {
    this.httpService.axiosRef.defaults.timeout = 3000;
    const response = await firstValueFrom(this.httpService.get(url));
    const $ = load(response.data);
    const info = $('div.row article.tabla-historico')
      .first()
      .find('.text-justify')
      .find('.alta')
      .text()
      .trim();

    if (info == undefined || info == null || info == '') {
      return 0.0;
    }
    return this.formatPrice(info);
  }

  private formatPrice(price: string): number {
    const info = price.split(' ');
    return Number(info[1].replace(',', '.'));
  }
}

export default MonitorService;
