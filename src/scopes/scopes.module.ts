import { Module } from '@nestjs/common';
import { ScopesService } from './scopes.service';
import { ScopesController } from './scopes.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { ScopeModel } from './models/scope.model';
import { ServiceModel } from './models/service.model';
import { ClientModel } from 'src/clients/models/client.model';

@Module({
  controllers: [ScopesController],
  providers: [ScopesService],
  imports: [
    SequelizeModule.forFeature([ScopeModel, ServiceModel, ClientModel]),
  ],
  exports: [ScopesService],
})
export class ScopesModule {}
