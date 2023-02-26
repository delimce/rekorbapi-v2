import CryptoInterface from 'src/crypto/domain/interfaces/crypto.interface';
import { CryptoServiceInterface } from 'src/crypto/domain/interfaces/cryptoService.interface';
import { Injectable } from '@nestjs/common';
import { CoinGeckoClient } from 'coingecko-api-v3';
import { CryptoCoin } from 'src/crypto/domain/dto/cryptoCoin';
import {
  GeckoGetCoinConfig,
  geckoGetCoinConfig,
  geckoMarketsConfig,
} from 'src/crypto/domain/valueObjects/gecko.values';

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
    const list = await this.client.coinMarket(geckoMarketsConfig);
    return await list.map((coin) => {
      return new CryptoCoin(
        coin.id,
        coin.name,
        coin.symbol,
        coin.current_price,
        'gecko',
        coin.market_cap_rank,
        coin.total_supply,
        coin.circulating_supply,
      );
    });
  }
  async getCryptoById(id: string): Promise<CryptoInterface | null> {
    this.setCoinIntoConfig(id);
    try {
      const details = await this.client.coinId(geckoGetCoinConfig);
      return new CryptoCoin(
        details.id,
        details.name,
        details.symbol,
        details.market_data.current_price.usd,
        'gecko',
        details.coingecko_rank,
        details.market_data.total_supply,
        details.market_data.circulating_supply,
      );
    } catch (error) {
      console.log(error.message);
      return null;
    }
  }

  setCoinIntoConfig(id: string): GeckoGetCoinConfig {
    geckoGetCoinConfig.id = id;
    return geckoGetCoinConfig;
  }
}
export default GeckoService;
