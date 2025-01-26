import CryptoType from '../types/crypto.type';

export class CryptoCoin implements CryptoType {
  constructor(
    public id: string,
    public symbol: string,
    public name: string,
    public price_usd: number,
    public platform: string,
    public rank?: number,
    public total_supply?: number,
    public circulating_supply?: number,
  ) { }
}
