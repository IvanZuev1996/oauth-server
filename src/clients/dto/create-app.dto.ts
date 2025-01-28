import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAppDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  readonly scopes: string[];

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
