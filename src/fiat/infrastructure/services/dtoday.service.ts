import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { PriceServiceInterface } from 'src/fiat/domain/interfaces/priceService.interface';

// dtoday url
const url = 'https://s3.amazonaws.com/dolartoday/data.json';

@Injectable()
class DtodayService implements PriceServiceInterface {
  constructor(private httpService: HttpService) {}

  async getPrice(): Promise<number> {
    this.httpService.axiosRef.defaults.timeout = 4000;
    const response = await firstValueFrom(this.httpService.get(url));
    return response.data.USD.dolartoday || 0.0;
  }
}

export default DtodayService;
