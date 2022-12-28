import { Controller, Get } from '@nestjs/common';
import { DtodayUseCase } from '../../application/prices';

@Controller('fiat')
export class PriceController {
  constructor(private readonly dtodayUseCase: DtodayUseCase) {}

  @Get('bcv')
  getPriceBcv() {
    return 'bcv';
  }

  @Get('dtoday')
  getPriceDtoday() {
    return this.dtodayUseCase.getPrice();
  }

  @Get('monitor')
  getPriceMonitor() {
    return 'monitor';
  }
}
