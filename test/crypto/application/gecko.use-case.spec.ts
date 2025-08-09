import { Test, TestingModule } from '@nestjs/testing';
import { GeckoUserCase } from '@/crypto/application/coins/gecko-use-case';
import {
  geckoCryptoService,
  CryptoServiceInterface,
} from '@/crypto/domain/interfaces/cryptoService.interface';
import CryptoType from '@/crypto/domain/types/crypto.type';

class CryptoServiceMock implements CryptoServiceInterface {
  constructor(
    private data: {
      ping: boolean;
      list: CryptoType[];
      byId: CryptoType | null;
    },
  ) {}
  async ping(): Promise<boolean> {
    return this.data.ping;
  }
  async getCryptoList(): Promise<CryptoType[]> {
    return this.data.list;
  }
  async getCryptoById(id: string): Promise<CryptoType | null> {
    if (id === 'unknown') {
      return null;
    }
    return this.data.byId;
  }
}

describe('GeckoUserCase', () => {
  let useCase: GeckoUserCase;
  let serviceMock: CryptoServiceMock;

  const sampleCoin: CryptoType = {
    id: 'bitcoin',
    name: 'Bitcoin',
    symbol: 'btc',
    price_usd: 100,
    platform: 'gecko',
    rank: 1,
    total_supply: 21000000,
    circulating_supply: 19000000,
  };

  beforeEach(async () => {
    serviceMock = new CryptoServiceMock({
      ping: true,
      list: [sampleCoin],
      byId: sampleCoin,
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GeckoUserCase,
        { provide: geckoCryptoService, useValue: serviceMock },
      ],
    }).compile();

    useCase = module.get(GeckoUserCase);
  });

  it('ping delegates to service', async () => {
    await expect(useCase.ping()).resolves.toBe(true);
  });

  it('getCryptoList delegates to service', async () => {
    await expect(useCase.getCryptoList()).resolves.toEqual([sampleCoin]);
  });

  it('getCryptoById returns coin', async () => {
    await expect(useCase.getCryptoById('bitcoin')).resolves.toEqual(sampleCoin);
  });

  it('getCryptoById returns null when not found', async () => {
    serviceMock = new CryptoServiceMock({ ping: true, list: [], byId: null });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GeckoUserCase,
        { provide: geckoCryptoService, useValue: serviceMock },
      ],
    }).compile();

    const uc = module.get(GeckoUserCase);
    await expect(uc.getCryptoById('unknown')).resolves.toBeNull();
  });
});
