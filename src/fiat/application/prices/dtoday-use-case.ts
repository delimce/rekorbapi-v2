import { Injectable, Inject } from '@nestjs/common';
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

  async getPrice(): Promise<number> {
    return this.dTodayService.getPrice();
  }
}
