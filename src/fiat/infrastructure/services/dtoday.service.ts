import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { PriceServiceInterface } from 'src/fiat/domain/interfaces/priceService.interface';

// dtoday url
const url = 'https://api.dtoday.org/api/dtoday';

Injectable();
class DtodayService implements PriceServiceInterface {
  constructor(private readonly httpService: HttpService) {}

  getPrice(): number {
    /* return this.httpService
          .get<Dtoday>(url)
          .toPromise()
          .then((res) => res.price); */
    return 0.1;
  }
}

export default DtodayService;
