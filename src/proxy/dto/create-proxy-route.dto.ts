import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsIn,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { RestMethods } from 'src/types';

export class ProxyRouteDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @ApiProperty({ enum: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'] })
  @IsNotEmpty()
  @IsString()
  @IsIn(['GET', 'POST', 'PUT', 'DELETE', 'PATCH'])
  readonly method: RestMethods;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly externalPath: string;
}

export class CreateProxyRouteDto {
  @ApiProperty({ type: [ProxyRouteDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProxyRouteDto)
  readonly routes: ProxyRouteDto[];
}
