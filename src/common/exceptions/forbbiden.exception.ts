import { HttpException, HttpStatus } from '@nestjs/common';

export class ForbiddenException extends HttpException {
  constructor(property: string, message: string) {
    super(
      {
        statusCode: HttpStatus.FORBIDDEN,
        errors: [{ property, message }],
      },
      HttpStatus.FORBIDDEN,
    );
  }
}
