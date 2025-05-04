import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProxyService } from './proxy.service';
import { CreateProxyRouteDto } from './dto/create-proxy-route.dto';
import { UpdateProxyRouteDto } from './dto/update-proxy-route.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators';
import { RolesEnum } from 'src/configs/roles';
import { DeleteProxyRouteDto, SetProxyRouteScopesDto } from './dto';

@ApiTags('Proxy')
@Controller('proxy')
@ApiBearerAuth()
export class ProxyController {
  constructor(private readonly proxyRoutesService: ProxyService) {}

  @ApiBearerAuth()
  @Roles(RolesEnum.ADMIN)
  @ApiOperation({ summary: 'get all proxy routes' })
  @Get()
  getProxyRoutes() {
    return this.proxyRoutesService.getProxyRoutes();
  }

  @ApiBearerAuth()
  @Roles(RolesEnum.ADMIN)
  @ApiOperation({ summary: 'create proxy routes' })
  @Post()
  createProxyRoutes(@Body() dto: CreateProxyRouteDto) {
    return this.proxyRoutesService.createProxyRoutes(dto);
  }

  @ApiBearerAuth()
  @Roles(RolesEnum.ADMIN)
  @ApiOperation({ summary: 'update proxy route' })
  @Patch()
  updateProxyRoute(@Body() dto: UpdateProxyRouteDto) {
    return this.proxyRoutesService.updateProxyRoute(dto);
  }

  @ApiBearerAuth()
  @Roles(RolesEnum.ADMIN)
  @ApiOperation({ summary: 'set proxy route scopes' })
  @Patch('set-scopes')
  setProxyRouteScopes(@Body() dto: SetProxyRouteScopesDto) {
    return this.proxyRoutesService.setProxyRouteScopes(dto);
  }

  @ApiBearerAuth()
  @Roles(RolesEnum.ADMIN)
  @ApiOperation({ summary: 'delete proxy route' })
  @Delete(':id')
  deleteProxyRoute(@Param() { id }: DeleteProxyRouteDto) {
    return this.proxyRoutesService.deleteProxyRoute(id);
  }
}
