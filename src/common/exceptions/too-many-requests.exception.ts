import { HttpException, HttpStatus } from '@nestjs/common';

export class TooManyRequestException extends HttpException {
  constructor(property: string, message: string) {
    super({ errors: [{ [property]: message }] }, HttpStatus.TOO_MANY_REQUESTS);
  }
}
