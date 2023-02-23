import { Module } from '@nestjs/common';
import { GeckoUserCase } from './application/coins/gecko-use-case';
import { geckoCryptoService } from './domain/interfaces/cryptoService.interface';
import { GeckoController } from './infrastructure/controllers/gecko.controller';
import GeckoService from './infrastructure/services/gecko.service';

@Module({
  imports: [],
  controllers: [GeckoController],
  providers: [
    { provide: geckoCryptoService, useClass: GeckoService },
    GeckoUserCase,
  ],
})
export class CryptoModule {}
