import { Module } from '@nestjs/common';
import { ProxyService } from './proxy.service';
import { ProxyController } from './proxy.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProxyRouteModel } from './models/proxy-routes.model';
import { ProxyRouteScopeModel } from './models/proxy-route-scopes.model';
import { ScopesModule } from 'src/scopes/scopes.module';

@Module({
  controllers: [ProxyController],
  providers: [ProxyService],
  imports: [
    SequelizeModule.forFeature([ProxyRouteScopeModel, ProxyRouteModel]),
    ScopesModule,
  ],
  exports: [ProxyService],
})
export class ProxyModule {}
