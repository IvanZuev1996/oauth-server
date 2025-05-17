import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class DeleteScopeDto {
  @ApiProperty()
  @IsString()
  readonly scopeKey: string;
}
