import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { ProxyRouteDto } from './create-proxy-route.dto';
import { IsIn, IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateProxyRouteDto extends PickType(ProxyRouteDto, [
  'externalPath',
  'method',
  'name',
]) {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  readonly routeId: number;
}
