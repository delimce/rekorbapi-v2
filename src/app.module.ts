import { Module } from '@nestjs/common';
import { FiatModule } from './fiat/fiat.module';

@Module({
  imports: [FiatModule],
})
export class AppModule {}
