import { FiatPrice } from 'src/fiat/domain/dto/fiatPrice';
import { Injectable, Inject } from '@nestjs/common';
import {
  PriceServiceInterface,
  monitorPriceService,
} from 'src/fiat/domain/interfaces/priceService.interface';

@Injectable()
export class MonitorUseCase {
  constructor(
    @Inject(monitorPriceService)
    private monitorService: PriceServiceInterface,
  ) {}

  async getPrice(): Promise<FiatPrice> {
    return this.monitorService.getFiatPrice();
  }
}
