import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import {
  BcvUseCase,
  MonitorUseCase,
  DtodayUseCase,
} from './application/prices';
import {
  priceService,
  bcvPriceService,
  monitorPriceService,
} from './domain/interfaces/priceService.interface';
import { currencyService } from './domain/interfaces/currencyService.interface';
import { PriceController } from './infrastructure/controllers/price.controller';
import BcvService from './infrastructure/services/bcv.service';
import DtodayService from './infrastructure/services/dtoday.service';
import MonitorService from './infrastructure/services/monitor.service';
import FloatRatesService from './infrastructure/services/floatRates.service';
import { CurrencyUseCase } from './application/currency/currency-use-case';
import { CurrencyController } from './infrastructure/controllers/currency.controller';

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
    { provide: priceService, useClass: DtodayService },
    { provide: monitorPriceService, useClass: MonitorService },
    { provide: bcvPriceService, useClass: BcvService },
    { provide: currencyService, useClass: FloatRatesService },
    DtodayUseCase,
    BcvUseCase,
    MonitorUseCase,
    CurrencyUseCase,
  ],
})
export class FiatModule {}
