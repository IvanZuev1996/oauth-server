import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { ValidationException } from '../exceptions/validation.exception';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
    const obj = plainToInstance(metadata.metatype, value);
    const errors = await validate(obj);

    if (errors.length) {
      let messages = [];

      errors.forEach((err) => {
        if (err.constraints) {
          messages.push({
            [err.property]: Object.values(err.constraints).join(', '),
          });
        }

        if (err.children.length) {
          err.children.forEach((err) => {
            if (err.constraints) {
              messages.push({
                [err.property]: Object.values(err.constraints).join(', '),
              });
            }
          });
        }
      });
      throw new ValidationException({ errors: messages });
    }
    return value;
  }
}
