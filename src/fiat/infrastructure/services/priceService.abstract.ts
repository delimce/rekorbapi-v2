import { FiatPrice } from 'src/fiat/domain/dto/fiatPrice';

abstract class PriceServiceAbstract {
  abstract code: string;
  abstract getPrice(): Promise<number>;
  async getFiatPrice(): Promise<FiatPrice> {
    const price = await this.getPrice();
    return new FiatPrice(
      this.code,
      'ves',
      price,
      1.0,
      this.code,
      new Date().toISOString(),
    );
  }
}

export default PriceServiceAbstract;
