import { Injectable, Inject } from '@nestjs/common';
import {
  CryptoServiceInterface,
  geckoCryptoService,
} from 'src/crypto/domain/interfaces/cryptoService.interface';

@Injectable()
export class GeckoUserCase {
  constructor(
    @Inject(geckoCryptoService)
    private cryptoService: CryptoServiceInterface,
  ) {}

  async ping(): Promise<boolean> {
    return this.cryptoService.ping();
  }
}
