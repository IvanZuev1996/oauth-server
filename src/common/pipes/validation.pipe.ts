import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  private isClass(metatype: any): boolean {
    const types = [String, Boolean, Number, Array];
    return (
      metatype && !types.includes(metatype) && typeof metatype === 'function'
    );
  }

  async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
    if (!metadata.metatype || !this.isClass(metadata.metatype)) {
      return value;
    }

    const obj = plainToInstance(metadata.metatype, value);
    const errors = await validate(obj);

    if (errors.length) {
      let messages = [];

      errors.forEach((err) => {
        if (err.constraints) {
          messages.push({
            property: err.property,
            message: Object.values(err.constraints).join(', '),
          });
        }

        if (err.children.length) {
          err.children.forEach((err) => {
            if (err.constraints) {
              messages.push({
                property: err.property,
                message: Object.values(err.constraints).join(', '),
              });
            }
          });
        }
      });
      throw new BadRequestException({ errors: messages });
    }
    return value;
  }
}
