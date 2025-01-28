import { Controller, Get } from '@nestjs/common';
import { BcvUseCase, BlueUseCase } from '@Fiat/application/prices';
@Controller('fiat')
export class PriceController {
  constructor(
    private readonly bcvUseCase: BcvUseCase,
    private readonly blueUseCase: BlueUseCase,
  ) {}

  @Get('bcv')
  getPriceBcv() {
    return this.bcvUseCase.getPrice();
  }

  @Get('blue')
  getPriceBlue() {
    return this.blueUseCase.getPrice();
  }
}
