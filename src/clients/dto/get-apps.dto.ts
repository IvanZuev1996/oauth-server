import { ApiProperty } from '@nestjs/swagger';
import {
  IsBooleanString,
  IsEnum,
  IsIn,
  IsOptional,
  IsString,
} from 'class-validator';
import { ClientStatus } from '../interfaces';

export class GetAppsDto {
  @ApiProperty()
  @IsEnum(ClientStatus)
  @IsOptional()
  readonly status: ClientStatus;
}
