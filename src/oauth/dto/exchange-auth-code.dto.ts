import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { AuthorizeDto } from './authorize.dto';

export class ExchangeAuthCodeDto extends PickType(AuthorizeDto, ['client_id']) {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly code: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly code_verifier: string;
}
