import { Module } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { ClientsController } from './clients.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { ClientModel } from './models/client.model';
import { ScopesModule } from 'src/scopes/scopes.module';
import { ClientRefreshTokensModel } from 'src/oauth/models/client-refresh-tokens.model';

@Module({
  controllers: [ClientsController],
  providers: [ClientsService],
  imports: [
    ScopesModule,
    SequelizeModule.forFeature([ClientModel, ClientRefreshTokensModel]),
  ],
  exports: [ClientsService],
})
export class ClientsModule {}
