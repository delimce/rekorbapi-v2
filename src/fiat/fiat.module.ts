import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { BcvUseCase, DtodayUseCase } from './application/prices';
import {
  priceService,
  bcvPriceService,
} from './domain/interfaces/priceService.interface';
import { PriceController } from './infrastructure/controllers/price.controller';
import BcvService from './infrastructure/services/bcv.service';
import DtodayService from './infrastructure/services/dtoday.service';

@Module({
  imports: [
    HttpModule.register({
      timeout: 4000,
      maxRedirects: 5,
    }),
  ],
  controllers: [PriceController],
  providers: [
    { provide: priceService, useClass: DtodayService },
    DtodayUseCase,
    { provide: bcvPriceService, useClass: BcvService },
    BcvUseCase,
  ],
})
export class FiatModule {}
