import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class GetScopesDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  readonly query?: string;
}
