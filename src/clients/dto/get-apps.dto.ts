import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { ClientStatus } from '../interfaces';

export class GetAppsDto {
  @ApiProperty()
  @IsEnum(ClientStatus)
  @IsOptional()
  readonly status: ClientStatus;
}
