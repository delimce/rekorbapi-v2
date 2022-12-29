import { Controller, Get } from '@nestjs/common';
import { DtodayUseCase, BcvUseCase } from '../../application/prices';

@Controller('fiat')
export class PriceController {
  constructor(
    private readonly dTodayUseCase: DtodayUseCase,
    private readonly bcvUseCase: BcvUseCase,
  ) {}

  @Get('bcv')
  getPriceBcv() {
    return this.bcvUseCase.getPrice();
  }

  @Get('dtoday')
  getPriceDtoday() {
    return this.dTodayUseCase.getPrice();
  }

  @Get('monitor')
  getPriceMonitor() {
    return 'monitor';
  }
}
