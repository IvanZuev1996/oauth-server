import { HttpException, HttpStatus } from '@nestjs/common';

export class ConflictException extends HttpException {
  constructor(property: string, message: string) {
    super(
      {
        statusCode: HttpStatus.CONFLICT,
        errors: [{ property, message }],
      },
      HttpStatus.CONFLICT,
    );
  }
}
