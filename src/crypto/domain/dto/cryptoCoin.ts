import CryptoInterface from '../interfaces/crypto.interface';

export class CryptoCoin implements CryptoInterface {
  constructor(
    public id: string,
    public symbol: string,
    public name: string,
    public price_usd: number,
    public platform: string,
    public rank?: number,
    public total_supply?: number,
    public circulating_supply?: number,
  ) {}
}
