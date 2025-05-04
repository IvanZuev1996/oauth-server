import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class DeleteProxyRouteDto {
  @ApiProperty()
  @IsNumber()
  readonly id: number;
}
