import { Module } from '@nestjs/common';
import { OauthService } from './oauth.service';
import { OauthController } from './oauth.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { ClientTokensModel } from './models/client-tokens.model';
import { ConsentsModel } from './models/consents.model';
import { OAuthCodesModel } from './models/oauth-codes.model';
import { ClientsModule } from 'src/clients/clients.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [OauthController],
  providers: [OauthService],
  imports: [
    ClientsModule,
    SequelizeModule.forFeature([
      ClientTokensModel,
      ConsentsModel,
      OAuthCodesModel,
    ]),
    JwtModule.register({}),
  ],
})
export class OauthModule {}
