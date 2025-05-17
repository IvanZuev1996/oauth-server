import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshOAuthTokenDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly refresh_token: string;
}
