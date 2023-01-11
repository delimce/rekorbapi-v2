import { Injectable, Inject } from '@nestjs/common';
import { FiatPrice } from 'src/fiat/domain/dto/fiatPrice';
import {
  PriceServiceInterface,
  bcvPriceService,
} from 'src/fiat/domain/interfaces/priceService.interface';

@Injectable()
export class BcvUseCase {
  constructor(
    @Inject(bcvPriceService)
    private bcvService: PriceServiceInterface,
  ) {}

  async getPrice(): Promise<FiatPrice> {
    return this.bcvService.getFiatPrice();
  }
}
