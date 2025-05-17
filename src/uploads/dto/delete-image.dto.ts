import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class DeleteImageDto {
  @ApiProperty()
  @IsString()
  path: string;
}
