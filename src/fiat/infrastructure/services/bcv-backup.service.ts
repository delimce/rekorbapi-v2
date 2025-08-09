import { Injectable } from '@nestjs/common';

import { PriceServiceInterface } from '@Fiat/domain/interfaces/priceService.interface';
import PriceServiceAbstract from './priceService.abstract';
import { HttpService } from '@nestjs/axios';

const url = 'https://exchange.vcoud.com/coins/latest';

@Injectable()
class BcvBackupService
  extends PriceServiceAbstract
  implements PriceServiceInterface
{
  constructor(private httpService: HttpService) {
    super();
  }

  code = 'BCV_BACKUP';
  currency = 'ves';

  async getPrice(): Promise<number> {
    try {
      const { data } = await this.httpService.axiosRef.get(url, {
        timeout: 6000,
      });
      const list = this.toList(data);
      const match = list.find(this.isTargetCoin);
      if (!match) return 0.0;
      const raw = match.price ?? 0.0;
      return Number(raw);
    } catch {
      return 0.0;
    }
  }

  // helpers
  private toList(payload: any): any[] {
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.data)) return payload.data;
    return [];
  }

  private isTargetCoin = (el: any): boolean => {
    const type = (el?.type ?? '').toLowerCase();
    const slug = (el?.slug ?? el?.slug ?? '').toLowerCase();
    return type === 'bolivar' && slug === 'dolar-bcv';
  };
}

export default BcvBackupService;
