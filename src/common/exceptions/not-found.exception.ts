import { HttpException, HttpStatus } from '@nestjs/common';

export class NotFoundException extends HttpException {
  constructor(property: string, message: string) {
    super({ errors: [{ [property]: message }] }, HttpStatus.NOT_FOUND);
  }
}
