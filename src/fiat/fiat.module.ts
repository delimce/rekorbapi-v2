import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { DtodayUseCase } from './application/prices';
import { priceService } from './domain/interfaces/priceService.interface';
import { PriceController } from './infrastructure/controllers/price.controller';
import DtodayService from './infrastructure/services/dtoday.service';

@Module({
  imports: [HttpModule],
  controllers: [PriceController],
  providers: [
    { provide: priceService, useClass: DtodayService },
    DtodayUseCase,
  ],
})
export class FiatModule {}
