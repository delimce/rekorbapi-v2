import { Controller, Get } from '@nestjs/common';
import {
  MonitorUseCase,
  BcvUseCase,
  DtodayUseCase,
} from '../../application/prices';

@Controller('fiat')
export class PriceController {
  constructor(
    private readonly dTodayUseCase: DtodayUseCase,
    private readonly bcvUseCase: BcvUseCase,
    private readonly monitorUseCase: MonitorUseCase,
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
    return this.monitorUseCase.getPrice();
  }
}
