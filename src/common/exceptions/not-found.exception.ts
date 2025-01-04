import { HttpException, HttpStatus } from '@nestjs/common';

export class NotFoundException extends HttpException {
  constructor(property: string, message: string) {
    super(
      {
        statusCode: HttpStatus.NOT_FOUND,
        errors: [{ property, message }],
      },
      HttpStatus.NOT_FOUND,
    );
  }
}
