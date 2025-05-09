import { Inject, Injectable, Logger } from '@nestjs/common';
import { CreateProxyRouteDto } from './dto/create-proxy-route.dto';
import { UpdateProxyRouteDto } from './dto/update-proxy-route.dto';
import { InjectModel } from '@nestjs/sequelize';
import { ProxyRouteModel } from './models/proxy-routes.model';
import { Repository } from 'sequelize-typescript';
import { ProxyRouteScopeModel } from './models/proxy-route-scopes.model';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Op, WhereOptions } from 'sequelize';
import {
  PROXY_ROUTE_EXIST,
  PROXY_ROUTE_NOT_FOUND,
  SCOPE_NOT_FOUND,
} from 'src/constants';
import { SetProxyRouteScopesDto } from './dto';
import { ScopesService } from 'src/scopes/scopes.service';
import { BadRequestException, ConflictException } from 'src/common/exceptions';
import { RestMethods } from 'src/types';

@Injectable()
export class ProxyService {
  constructor(
    /* Models */
    @InjectModel(ProxyRouteModel)
    private proxyRoutesRepo: Repository<ProxyRouteModel>,
    @InjectModel(ProxyRouteScopeModel)
    private proxyScopesRepo: Repository<ProxyRouteScopeModel>,

    /* Logger */
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,

    /* Services */
    private readonly scopesService: ScopesService,
  ) {}

  async getProxyRoutes() {
    const routes = await this.proxyRoutesRepo.findAndCountAll({
      include: {
        model: ProxyRouteScopeModel,
        attributes: ['scopeKey'],
      },
    });

    return {
      count: routes.count,
      rows: routes.rows.map((r) => ({
        ...r.toJSON(),
        scopes: r.scopes.map((s) => s.scopeKey),
      })),
    };
  }

  async createProxyRoute(dto: CreateProxyRouteDto) {
    await this.checkRouteExists(dto.method, dto.externalPath);
    await this.checkRouteName(dto.name);

    const { scopes, ...payload } = dto;
    const proxyRoute = await this.proxyRoutesRepo.create(payload);

    if (dto.scopes) {
      await this.setProxyRouteScopes({
        routeId: proxyRoute.id,
        scopes: dto.scopes,
      });
    }

    return proxyRoute;
  }

  async updateProxyRoute(dto: UpdateProxyRouteDto) {
    const route = await this.proxyRoutesRepo.findByPk(dto.routeId);
    if (!route) throw new BadRequestException('route', PROXY_ROUTE_NOT_FOUND);

    await this.checkRouteExists(dto.method, dto.externalPath, route.id);
    await this.checkRouteName(dto.name, route.id);

    if (dto.scopes) {
      await this.setProxyRouteScopes({
        routeId: route.id,
        scopes: dto.scopes,
      });
    }

    route.name = dto.name;
    route.method = dto.method;
    route.externalPath = dto.externalPath;
    route.externalHost = dto.externalHost;
    return await route.save();
  }

  async setProxyRouteScopes(dto: SetProxyRouteScopesDto) {
    const route = await this.proxyRoutesRepo.findByPk(dto.routeId);
    if (!route) throw new BadRequestException('route', PROXY_ROUTE_NOT_FOUND);

    for (const scope of dto.scopes) {
      const scopeEntity = await this.scopesService.getScopeByKey(scope);
      if (!scopeEntity) throw new BadRequestException('scope', SCOPE_NOT_FOUND);
    }

    await this.proxyScopesRepo.destroy({ where: { routeId: route.id } });
    const routeScopes = await this.proxyScopesRepo.bulkCreate(
      dto.scopes.map((scope) => ({ routeId: route.id, scopeKey: scope })),
    );

    return routeScopes;
  }

  async deleteProxyRoute(id: number) {
    return await this.proxyRoutesRepo.destroy({ where: { id } });
  }

  private async checkRouteExists(
    method: string,
    externalPath: string,
    excludeId?: number,
  ) {
    const where: WhereOptions = { method, externalPath };
    if (excludeId) where.id = { [Op.ne]: excludeId };

    const exists = await this.proxyRoutesRepo.findOne({ where });
    if (exists) throw new BadRequestException('route', PROXY_ROUTE_EXIST);
  }

  private async checkRouteName(name: string, excludeId?: number) {
    const where: WhereOptions = { name };
    if (excludeId) where.id = { [Op.ne]: excludeId };

    const exists = await this.proxyRoutesRepo.findOne({ where });
    console.log(exists);
    if (exists) throw new BadRequestException('route', PROXY_ROUTE_EXIST);
  }

  async getProxyRouteById(id: number) {
    const route = await this.proxyRoutesRepo.findByPk(id);
    if (!route) throw new BadRequestException('route', PROXY_ROUTE_NOT_FOUND);
    return route;
  }

  async getProxyRouteScopes(routeId: number) {
    return await this.proxyScopesRepo.findAll({ where: { routeId } });
  }

  async getProxyRouteByPath(path: string, method: RestMethods) {
    const route = await this.proxyRoutesRepo.findOne({
      where: { externalPath: path, method },
    });
    if (!route) throw new BadRequestException('route', PROXY_ROUTE_NOT_FOUND);
    return route;
  }
}
