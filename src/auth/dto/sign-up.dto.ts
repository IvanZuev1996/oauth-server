import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length, Matches } from 'class-validator';
import {
  LOGIN_REGEX,
  TG_REGEX,
  USER_LOGIN_ERROR,
  USER_PASSWORD_LENGTH_ERROR,
  USER_PASSWORD_STRING_ERROR,
  USER_TELEGRAM_ERROR,
} from 'src/constants';

export class SignUpDto {
  @ApiProperty()
  @Matches(LOGIN_REGEX, { message: USER_LOGIN_ERROR })
  readonly login: string;

  @ApiProperty()
  @Matches(TG_REGEX, { message: USER_TELEGRAM_ERROR })
  readonly telegram: string;

  @ApiProperty()
  @IsEmail()
  readonly email: string;

  @ApiProperty()
  @IsString({ message: USER_PASSWORD_STRING_ERROR })
  @Length(8, 50, { message: USER_PASSWORD_LENGTH_ERROR })
  readonly password: string;
}
