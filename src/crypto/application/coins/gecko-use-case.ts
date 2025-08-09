import { Injectable, Inject } from '@nestjs/common';
import CryptoType from '@Crypto/domain/types/crypto.type';
import {
  CryptoServiceInterface,
  geckoCryptoService,
} from '@Crypto/domain/interfaces/cryptoService.interface';

@Injectable()
export class GeckoUserCase {
  constructor(
    @Inject(geckoCryptoService)
    private cryptoService: CryptoServiceInterface,
  ) {}

  async ping(): Promise<boolean> {
    return this.cryptoService.ping();
  }

  async getCryptoList(): Promise<CryptoType[]> {
    return this.cryptoService.getCryptoList();
  }

  async getCryptoById(id: string): Promise<CryptoType | null> {
    return this.cryptoService.getCryptoById(id);
  }
}
