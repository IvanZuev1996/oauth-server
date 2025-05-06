import { ApiProperty, PickType } from '@nestjs/swagger';
import { CreateProxyRouteDto } from './create-proxy-route.dto';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateProxyRouteDto extends PickType(CreateProxyRouteDto, [
  'externalPath',
  'method',
  'name',
  'scopes',
]) {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  readonly routeId: number;
}
