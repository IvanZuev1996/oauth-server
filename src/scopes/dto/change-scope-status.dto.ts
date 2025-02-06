import { ApiProperty, PickType } from '@nestjs/swagger';
import { DeleteScopeDto } from './delete-scope.dto';
import { ScopeStatus } from '../interfaces';
import { IsEnum } from 'class-validator';

export class ChangeScopeStatusDto extends PickType(DeleteScopeDto, [
  'scopeKey',
]) {
  @ApiProperty()
  @IsEnum(ScopeStatus)
  status: ScopeStatus;
}
