import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ConfirmCodeDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly request_id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly code: string;
}
