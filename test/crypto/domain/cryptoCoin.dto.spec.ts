import { CryptoCoin } from '@/crypto/domain/dto/cryptoCoin';

describe('CryptoCoin DTO', () => {
  it('constructs with provided fields', () => {
    const dto = new CryptoCoin('id', 'sym', 'name', 1, 'gecko', 2, 3, 4);
    expect(dto).toMatchObject({
      id: 'id',
      name: 'name',
      symbol: 'sym',
      price_usd: 1,
      platform: 'gecko',
      rank: 2,
      total_supply: 3,
      circulating_supply: 4,
    });
  });
});
