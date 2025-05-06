import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { RestMethods } from 'src/types';

export class CreateProxyRouteDto {
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

  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  readonly scopes?: string[];
}
