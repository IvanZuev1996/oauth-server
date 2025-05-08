import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { CreateScopeDto } from './create-scope.dto';

export class UpdateScopeDto extends PickType(CreateScopeDto, [
  'requiresApproval',
  'title',
  'ttl',
]) {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  scopeKey: string;
}
