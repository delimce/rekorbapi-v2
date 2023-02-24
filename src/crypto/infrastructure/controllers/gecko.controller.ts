import { Controller, Get } from '@nestjs/common';
import { GeckoUserCase } from 'src/crypto/application/coins';

@Controller('crypto/gecko')
export class GeckoController {
  constructor(private readonly geckoUseCase: GeckoUserCase) {}
  @Get('ping')
  ping() {
    return this.geckoUseCase.ping();
  }

  @Get('list')
  async list() {
    return this.geckoUseCase.getCryptoList();
  }
}
