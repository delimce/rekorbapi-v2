import { Module } from '@nestjs/common';
import { FiatModule } from './fiat/fiat.module';
import { CryptoModule } from './crypto/crypto.module';

@Module({
  imports: [FiatModule, CryptoModule],
})
export class AppModule {}
