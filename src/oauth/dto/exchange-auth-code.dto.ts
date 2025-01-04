import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { AuthorizeDto } from './authorize.dto';

export class ExchangeAuthCodeDto extends PickType(AuthorizeDto, ['clientId']) {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly code: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly codeVerifier: string;
}
