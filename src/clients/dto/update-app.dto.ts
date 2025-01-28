import { ApiProperty, IntersectionType, PickType } from '@nestjs/swagger';
import { CreateAppDto } from './create-app.dto';
import { IsString } from 'class-validator';
import { ChangeAppStatusDto } from './change-app-status.dto';

export class UpdateAppDto extends IntersectionType(
  CreateAppDto,
  PickType(ChangeAppStatusDto, ['options', 'clientId'] as const),
) {
  @ApiProperty()
  @IsString()
  clientId: string;
}
