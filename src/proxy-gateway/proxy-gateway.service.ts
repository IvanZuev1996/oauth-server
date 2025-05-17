import { HttpService } from '@nestjs/axios';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { firstValueFrom } from 'rxjs';
import { ClientsService } from 'src/clients/clients.service';
import { BadRequestException, ForbiddenException } from 'src/common/exceptions';
import { ACCESS_DENIED } from 'src/constants';
import { ProxyService } from 'src/proxy/proxy.service';
import { RestMethods } from 'src/types';

@Injectable()
export class ProxyGatewayService {
  constructor(
    private readonly httpService: HttpService,
    private readonly proxyService: ProxyService,
    private readonly clientsService: ClientsService,
    private readonly configService: ConfigService,

    /* Logger */
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async handleRequest(req: Request, res: Response, clientId: string) {
    const externalPath = req.originalUrl.split('/api/proxy-gateway')[1];
    const route = await this.proxyService.getProxyRouteByPath(
      externalPath,
      req.method as RestMethods,
    );

    const scopes = await this.proxyService.getProxyRouteScopes(route.id);
    const client = await this.clientsService.getClientByClientId(clientId);

    for (const scope of scopes) {
      const key = scope.scopeKey;
      if (client.scopes.includes(key)) continue;
      throw new ForbiddenException('scopes', ACCESS_DENIED);
    }

    const secret = await this.configService.get('PROXY_SHARED_SECRET');

    try {
      const response = await firstValueFrom(
        this.httpService.request({
          method: req.method,
          url: route.externalHost + route.externalPath,
          headers: {
            ...req.headers,
            'x-proxy-secret': secret,
          },
          data: req.body,
        }),
      );
      return res.status(response.status).send(response.data);
    } catch (error) {
      this.logger.error('Error during proxy request:', error);
      console.log(error);
      if (error.response) {
        return res
          .status(error.response.status)
          .send(error.response.data || error.message);
      }
      return res.status(500).send('Internal Server Error');
    }
  }
}
