import { ApiProperty, PickType } from '@nestjs/swagger';
import { DeleteAppDto } from './delete-app.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class RevokeTokenDto extends PickType(DeleteAppDto, ['clientId']) {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly tokenId: string;
}
