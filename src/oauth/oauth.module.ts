import { Module } from '@nestjs/common';
import { OauthService } from './oauth.service';
import { OauthController } from './oauth.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { ClientRefreshTokensModel } from './models/client-refresh-tokens.model';
import { ConsentsModel } from './models/consents.model';
import { OAuthCodesModel } from './models/oauth-codes.model';
import { ClientsModule } from 'src/clients/clients.module';
import { JwtModule } from '@nestjs/jwt';
import { OAuthAccessTokenStrategy } from './strategies';
import { ScopesModule } from 'src/scopes/scopes.module';

@Module({
  controllers: [OauthController],
  providers: [OauthService, OAuthAccessTokenStrategy],
  imports: [
    ClientsModule,
    ScopesModule,
    SequelizeModule.forFeature([
      ClientRefreshTokensModel,
      ConsentsModel,
      OAuthCodesModel,
    ]),
    JwtModule.register({}),
  ],
})
export class OauthModule {}
