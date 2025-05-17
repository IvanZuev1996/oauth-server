import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AuthorizeDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly client_id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly response_type: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  readonly scope: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  readonly redirect_uri: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly code_challenge: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly code_challenge_method: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  readonly state: string;
}
