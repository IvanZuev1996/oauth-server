import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString } from 'class-validator';

export class DeleteProxyRouteDto {
  @ApiProperty()
  @IsNumberString()
  readonly id: string;
}
