import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

class GeoOptions {
  @ApiProperty()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  allowedCountries?: string[];

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  deniedCountries?: string[];
}

class FromTo {
  @ApiProperty()
  @IsNumber()
  from: number;

  @ApiProperty()
  @IsNumber()
  to: number;
}

class ScopesOptions {
  @ApiProperty()
  @IsOptional()
  @ValidateNested()
  @Type(() => FromTo)
  timeOfDay?: FromTo;

  @ApiProperty()
  @IsOptional()
  @ValidateNested()
  @Type(() => FromTo)
  dayOfWeek?: FromTo;

  @ApiProperty()
  @IsOptional()
  @ValidateNested()
  @Type(() => FromTo)
  dayOfMonth?: FromTo;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  requestsPerMinute?: number;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  dependentScopes?: string[];

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  ipWhitelist?: string[];

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  ipBlacklist?: string[];

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  userRoles?: number[];

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  projects?: string[];

  @ApiProperty()
  @IsOptional()
  @ValidateNested()
  @Type(() => GeoOptions)
  geo?: GeoOptions;
}

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

  @ApiProperty()
  @IsOptional()
  @ValidateNested()
  @Type(() => ScopesOptions)
  readonly options: ScopesOptions;
}
