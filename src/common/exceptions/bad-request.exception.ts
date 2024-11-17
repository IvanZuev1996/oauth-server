import { HttpException, HttpStatus } from '@nestjs/common';

export class BadRequestException extends HttpException {
  constructor(property: string, message: string) {
    super({ errors: [{ [property]: message }] }, HttpStatus.BAD_REQUEST);
  }
}
