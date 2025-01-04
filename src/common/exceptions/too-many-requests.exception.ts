import { HttpException, HttpStatus } from '@nestjs/common';

export class TooManyRequestException extends HttpException {
  constructor(property: string, message: string) {
    super(
      {
        statusCode: HttpStatus.TOO_MANY_REQUESTS,
        errors: [{ property, message }],
      },
      HttpStatus.TOO_MANY_REQUESTS,
    );
  }
}
