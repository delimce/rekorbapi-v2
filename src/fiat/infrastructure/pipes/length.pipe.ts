import { PipeTransform, BadRequestException } from '@nestjs/common';

export class LengthPipe implements PipeTransform<string> {
  transform(value: string) {
    // if value contains a number, throw an error
    if (/\d/.test(value)) {
      throw new BadRequestException('currency code cannot contain a number');
    }

    if (value.length !== 3) {
      throw new BadRequestException('wrong currency code');
    }

    return value;
  }
}
