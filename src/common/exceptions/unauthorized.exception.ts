import { HttpException, HttpStatus } from '@nestjs/common';
import { UNAUTHORIZED } from 'src/constants';

export class UnauthorizedException extends HttpException {
  constructor() {
    super({ error: UNAUTHORIZED }, HttpStatus.UNAUTHORIZED);
  }
}
