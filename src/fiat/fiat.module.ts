import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { BcvUseCase, BlueUseCase } from './application/prices';
import {
  bcvPriceService,
  bluePriceService,
} from './domain/interfaces/priceService.interface';
import { CurrencyController } from './infrastructure/controllers/currency.controller';
import { currencyService } from './domain/interfaces/currencyService.interface';
import { PriceController } from './infrastructure/controllers/price.controller';
import FloatRatesService from './infrastructure/services/floatRates.service';
import { CurrencyUseCase } from './application/currency/currency-use-case';
import BlueService from './infrastructure/services/blue.service';
import BcvService from './infrastructure/services/bcv.service';

@Module({
  imports: [
    HttpModule.register({
      timeout: 4000,
      maxRedirects: 5,
      headers: {
        'Content-Type': 'application/json',
        'Accept-Encoding': 'gzip,deflate,compress',
      },
    }),
  ],
  controllers: [PriceController, CurrencyController],
  providers: [
    { provide: currencyService, useClass: FloatRatesService },
    { provide: bluePriceService, useClass: BlueService },
    { provide: bcvPriceService, useClass: BcvService },
    CurrencyUseCase,
    BlueUseCase,
    BcvUseCase,
  ],
})
export class FiatModule {}
