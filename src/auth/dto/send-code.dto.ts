import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsBooleanString, IsOptional } from 'class-validator';
import { SignInDto } from './sign-in.dto';

export class SendCodeDto extends PickType(SignInDto, ['login_or_tg']) {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsBooleanString()
  readonly send_login?: string;
}
