import { Injectable, Inject } from '@nestjs/common';
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

  async getPrice(): Promise<number> {
    return this.bcvService.getPrice();
  }
}
