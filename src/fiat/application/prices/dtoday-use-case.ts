import { Injectable, Inject } from '@nestjs/common';
import { FiatPrice } from 'src/fiat/domain/dto/fiatPrice';
import {
  PriceServiceInterface,
  priceService,
} from 'src/fiat/domain/interfaces/priceService.interface';

@Injectable()
export class DtodayUseCase {
  constructor(
    @Inject(priceService)
    private dTodayService: PriceServiceInterface,
  ) {}

  async getPrice(): Promise<FiatPrice> {
    return this.dTodayService.getFiatPrice();
  }
}
