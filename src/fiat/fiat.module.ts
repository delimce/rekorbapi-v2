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
import { PriceController } from './infrastructure/controllers/price.controller';
import BcvService from './infrastructure/services/bcv.service';
import DtodayService from './infrastructure/services/dtoday.service';
import MonitorService from './infrastructure/services/monitor.service';

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
  controllers: [PriceController],
  providers: [
    { provide: priceService, useClass: DtodayService },
    { provide: monitorPriceService, useClass: MonitorService },
    { provide: bcvPriceService, useClass: BcvService },
    DtodayUseCase,
    BcvUseCase,
    MonitorUseCase,
  ],
})
export class FiatModule {}
