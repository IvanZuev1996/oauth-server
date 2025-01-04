import { HttpException, HttpStatus } from '@nestjs/common';
import { UNAUTHORIZED } from 'src/constants';

export class UnauthorizedException extends HttpException {
  constructor() {
    super(
      {
        statusCode: HttpStatus.UNAUTHORIZED,
        errors: [{ property: 'auth', message: UNAUTHORIZED }],
      },
      HttpStatus.UNAUTHORIZED,
    );
  }
}
