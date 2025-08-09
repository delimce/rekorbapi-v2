import { FiatPrice } from '@Fiat/domain/dto/fiatPrice';
import { Injectable, Inject } from '@nestjs/common';
import {
  PriceServiceInterface,
  bluePriceService,
} from '@Fiat/domain/interfaces/priceService.interface';

@Injectable()
export class BlueUseCase {
  constructor(
    @Inject(bluePriceService)
    private blueService: PriceServiceInterface,
  ) {}

  async getPrice(): Promise<FiatPrice> {
    return this.blueService.getFiatPrice();
  }
}
