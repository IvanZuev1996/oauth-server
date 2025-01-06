import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

export class AuthorizeDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly clientId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly scope: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  readonly redirectUri: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly codeChallenge: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly codeChallengeMethod: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  readonly state: string;
}
