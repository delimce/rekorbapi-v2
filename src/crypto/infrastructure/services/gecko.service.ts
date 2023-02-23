import CryptoInterface from 'src/crypto/domain/interfaces/crypto.interface';
import { CryptoServiceInterface } from 'src/crypto/domain/interfaces/cryptoService.interface';
import { Injectable } from '@nestjs/common';
import { CoinGeckoClient } from 'coingecko-api-v3';

@Injectable()
class GeckoService implements CryptoServiceInterface {
  private client: CoinGeckoClient;
  constructor() {
    this.client = new CoinGeckoClient({
      timeout: 10000,
      autoRetry: true,
    });
  }

  async ping(): Promise<boolean> {
    const ping = await this.client.ping();
    return ping.gecko_says === '(V3) To the Moon!';
  }

  async getCryptoList(): Promise<CryptoInterface[]> {
    throw new Error('Method not implemented.');
  }
  async getCryptoById(id: string): Promise<CryptoInterface | null> {
    throw new Error('Method not implemented.');
  }
  async getCryptoBySymbol(symbol: string): Promise<CryptoInterface | null> {
    throw new Error('Method not implemented.');
  }
}
export default GeckoService;
