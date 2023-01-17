import { Controller, Get, Param } from '@nestjs/common';
import { LengthPipe } from 'src/fiat/infrastructure/pipes/length.pipe';
import { CurrencyUseCase } from 'src/fiat/application/currency/currency-use-case';

@Controller('fiat')
export class CurrencyController {
  constructor(private readonly currencyUseCase: CurrencyUseCase) {}

  @Get('currency')
  getAll() {
    return this.currencyUseCase.getAll();
  }

  @Get('currency/:code')
  getByCurrency(@Param('code', new LengthPipe()) currency: string) {
    return this.currencyUseCase.getByCurrency(currency);
  }
}
