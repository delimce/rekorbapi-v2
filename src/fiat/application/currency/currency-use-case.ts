import { Injectable, Inject } from '@nestjs/common';
import {
  currencyService,
  CurrencyServiceInterface,
} from 'src/fiat/domain/interfaces/currencyService.interface';

@Injectable()
export class CurrencyUseCase {
  constructor(
    @Inject(currencyService)
    private currencyExchangeService: CurrencyServiceInterface,
  ) {}

  async getByCurrency(currency: string): Promise<any> {
    return this.currencyExchangeService.getByCurrency(currency);
  }

  async getAll(): Promise<any> {
    return this.currencyExchangeService.getAll();
  }
}
