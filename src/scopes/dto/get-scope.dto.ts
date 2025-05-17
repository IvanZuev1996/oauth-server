import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetScopeDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly scopeKey: string;
}
