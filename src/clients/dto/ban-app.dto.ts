import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';
import { DeleteAppDto } from './delete-app.dto';

export class BanAppDto extends PickType(DeleteAppDto, ['clientId']) {
  @ApiProperty()
  @IsBoolean()
  readonly isBanned: boolean;
}
