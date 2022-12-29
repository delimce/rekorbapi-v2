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

  async getPrice(): Promise<number> {
    return this.monitorService.getPrice();
  }
}
