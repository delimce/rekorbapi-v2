import { Injectable, Inject } from '@nestjs/common';
import CryptoInterface from 'src/crypto/domain/interfaces/crypto.interface';
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

  async getCryptoList(): Promise<CryptoInterface[]> {
    return this.cryptoService.getCryptoList();
  }
}
