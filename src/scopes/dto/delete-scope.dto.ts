import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class DeleteScopeDto {
  @ApiProperty()
  @IsNumber()
  readonly scopeId: number;
}
