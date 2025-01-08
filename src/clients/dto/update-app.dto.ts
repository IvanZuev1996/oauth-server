import { ApiProperty, PickType } from '@nestjs/swagger';
import { CreateAppDto } from './create-app.dto';
import { IsString } from 'class-validator';

export class UpdateAppDto extends PickType(CreateAppDto, [
  'companyEmail',
  'img',
  'name',
  'redirectUri',
  'scope',
]) {
  @ApiProperty()
  @IsString()
  clientId: string;
}
