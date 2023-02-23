import CryptoInterface from './crypto.interface';

export interface CryptoServiceInterface {
  ping(): Promise<boolean>; // ping service
  getCryptoList(): Promise<CryptoInterface[]>; // get all crypto list
  getCryptoById(id: string): Promise<CryptoInterface | null>; // get crypto by id
  getCryptoBySymbol(symbol: string): Promise<CryptoInterface | null>; // get crypto by symbol
}

export const geckoCryptoService = Symbol('GeckoCryptoServiceInterface');
