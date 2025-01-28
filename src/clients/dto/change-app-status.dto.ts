import { ApiProperty, PickType } from '@nestjs/swagger';
import { UpdateAppDto } from './update-app.dto';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ClientStatus } from '../interfaces';
import { DeleteAppDto } from './delete-app.dto';

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
  @IsBoolean()
  workingDaysOnly?: boolean;

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
  @ValidateNested()
  @Type(() => GeoOptions)
  geo?: GeoOptions;
}

export class ChangeAppStatusDto extends PickType(DeleteAppDto, ['clientId']) {
  @ApiProperty()
  @IsEnum(ClientStatus)
  readonly status: ClientStatus;

  @ApiProperty()
  @IsOptional()
  @ValidateNested()
  @Type(() => ScopesOptions)
  readonly options: ScopesOptions;
}
