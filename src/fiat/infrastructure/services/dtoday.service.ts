import { PriceServiceInterface } from 'src/fiat/domain/interfaces/priceService.interface';
import PriceServiceAbstract from './priceService.abstract';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

// dtoday url
const url = 'https://s3.amazonaws.com/dolartoday/data.json';

@Injectable()
class DtodayService
  extends PriceServiceAbstract
  implements PriceServiceInterface
{
  constructor(private httpService: HttpService) {
    super();
  }
  code = 'DTODAY';
  currency = 'ves';
  async getPrice(): Promise<number> {
    this.httpService.axiosRef.defaults.timeout = 4000;
    const response = await firstValueFrom(this.httpService.get(url));
    return response.data.USD.dolartoday || 0.0;
  }
}

export default DtodayService;
