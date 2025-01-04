import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateAppDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @ApiProperty({
    isArray: true,
    type: 'number',
  })
  @IsNotEmpty()
  @IsArray()
  @IsNumber({}, { each: true })
  readonly scope: number[];

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
