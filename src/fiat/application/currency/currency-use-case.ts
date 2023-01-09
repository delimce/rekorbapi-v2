import { Injectable, Inject } from '@nestjs/common';
import {
  currencyService,
  CurrencyServiceInterface,
} from 'src/fiat/domain/interfaces/currencyService.interface';

@Injectable()
export class CurrencyUseCase {
  constructor(
    @Inject(currencyService)
    private currencyService: CurrencyServiceInterface,
  ) {}

  async getByCurrency(currency: string): Promise<any> {
    return this.currencyService.getByCurrency(currency);
  }

  async getAll(): Promise<any> {
    return this.currencyService.getAll();
  }
}
