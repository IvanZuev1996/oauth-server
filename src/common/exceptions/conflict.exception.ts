import { HttpException, HttpStatus } from '@nestjs/common';

export class ConflictException extends HttpException {
  constructor(property: string, message: string) {
    super({ errors: [{ [property]: message }] }, HttpStatus.CONFLICT);
  }
}
