import CryptoType from '@Crypto/domain/types/crypto.type';

export interface CryptoServiceInterface {
  ping(): Promise<boolean>; // ping service
  getCryptoList(): Promise<CryptoType[]>; // get all crypto list
  getCryptoById(id: string): Promise<CryptoType | null>; // get crypto by id
}

export const geckoCryptoService = Symbol('GeckoCryptoServiceInterface');
