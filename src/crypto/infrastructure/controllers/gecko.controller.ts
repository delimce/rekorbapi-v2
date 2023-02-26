import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
} from '@nestjs/common';
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

  @Get('details/:id')
  async details(@Param('id') id: string) {
    const response = await this.geckoUseCase.getCryptoById(id);
    if (!response) {
      throw new HttpException('Coin not Found', HttpStatus.NOT_FOUND);
    }
    return response;
  }
}
