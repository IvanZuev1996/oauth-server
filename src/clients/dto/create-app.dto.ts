import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAppDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly scope: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  readonly img: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly companyEmail: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly redirectUri: string;
}
