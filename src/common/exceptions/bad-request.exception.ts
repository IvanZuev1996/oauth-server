import { HttpException, HttpStatus } from '@nestjs/common';

export class BadRequestException extends HttpException {
  constructor(property: string, message: string) {
    super(
      {
        statusCode: HttpStatus.BAD_REQUEST,
        errors: [{ property, message }],
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
