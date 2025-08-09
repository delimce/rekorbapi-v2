import { Test, TestingModule } from '@nestjs/testing';
import { GeckoController } from '@/crypto/infrastructure/controllers/gecko.controller';
import { GeckoUserCase } from '@/crypto/application/coins/gecko-use-case';

describe('GeckoController', () => {
  let controller: GeckoController;
  const useCase = {
    ping: jest.fn(),
    getCryptoList: jest.fn(),
    getCryptoById: jest.fn(),
  } as unknown as GeckoUserCase;

  beforeEach(async () => {
    (useCase.ping as jest.Mock).mockReset();
    (useCase.getCryptoList as jest.Mock).mockReset();
    (useCase.getCryptoById as jest.Mock).mockReset();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [GeckoController],
      providers: [{ provide: GeckoUserCase, useValue: useCase }],
    }).compile();

    controller = module.get<GeckoController>(GeckoController);
  });

  it('ping returns useCase result', async () => {
    (useCase.ping as jest.Mock).mockResolvedValue(true);
    await expect(controller.ping()).resolves.toBe(true);
  });

  it('list returns useCase result', async () => {
    (useCase.getCryptoList as jest.Mock).mockResolvedValue([]);
    await expect(controller.list()).resolves.toEqual([]);
  });

  it('details returns coin or throws 404', async () => {
    (useCase.getCryptoById as jest.Mock).mockResolvedValue({ id: 'btc' });
    await expect(controller.details('btc')).resolves.toEqual({ id: 'btc' });

    (useCase.getCryptoById as jest.Mock).mockResolvedValue(null);
    await expect(controller.details('missing')).rejects.toMatchObject({
      status: 404,
    });
  });
});
