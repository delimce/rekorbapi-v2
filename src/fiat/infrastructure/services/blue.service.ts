import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { PriceServiceInterface } from 'src/fiat/domain/interfaces/priceService.interface';
import PriceServiceAbstract from './priceService.abstract';

const url = 'https://api.bluelytics.com.ar/v2/latest';

@Injectable()
class BlueService
  extends PriceServiceAbstract
  implements PriceServiceInterface
{
  constructor(private httpService: HttpService) {
    super();
  }
  code = 'BLUE'; // argentina blue price
  currency = 'ars';
  async getPrice(): Promise<number> {
    this.httpService.axiosRef.defaults.timeout = 4000;
    const response = await firstValueFrom(this.httpService.get(url));
    return response.data.blue.value_buy || 0.0;
  }
}

export default BlueService;
