import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString } from 'class-validator';

export class SetProxyRouteScopesDto {
  @ApiProperty()
  @IsNumber()
  readonly routeId: number;

  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  readonly scopes: string[];
}
