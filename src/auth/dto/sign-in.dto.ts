import { ApiProperty, PickType } from '@nestjs/swagger';
import { SignUpDto } from './sign-up.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class SignInDto extends PickType(SignUpDto, ['visit_id'] as const) {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly login_or_tg: string;
}
