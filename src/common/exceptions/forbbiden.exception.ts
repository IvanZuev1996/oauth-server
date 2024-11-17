import { HttpException, HttpStatus } from '@nestjs/common';

export class ForbiddenException extends HttpException {
  constructor(property: string, message: string) {
    super({ errors: [{ [property]: message }] }, HttpStatus.FORBIDDEN);
  }
}
