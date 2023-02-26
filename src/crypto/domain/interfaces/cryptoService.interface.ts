import CryptoInterface from './crypto.interface';

export interface CryptoServiceInterface {
  ping(): Promise<boolean>; // ping service
  getCryptoList(): Promise<CryptoInterface[]>; // get all crypto list
  getCryptoById(id: string): Promise<CryptoInterface | null>; // get crypto by id
}

export const geckoCryptoService = Symbol('GeckoCryptoServiceInterface');
