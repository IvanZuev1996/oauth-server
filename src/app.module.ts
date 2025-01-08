import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { SequelizeModule } from '@nestjs/sequelize';
import { sequelizeConfig } from './configs/sequelize';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from './configs/winston';
import { RolesModule } from './roles/roles.module';
import { UsersModule } from './users/users.module';
import {
  UserAccessTokenGuard,
  RoleGuard,
  OAuthAccessTokenGuard,
  ScopesGuard,
} from './common/guards';
import { OauthModule } from './oauth/oauth.module';
import { AuthModule } from './auth/auth.module';
import { ClientsModule } from './clients/clients.module';
import { ScopesModule } from './scopes/scopes.module';

@Module({
  imports: [
    WinstonModule.forRoot(winstonConfig),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['./.env'],
    }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (c: ConfigService) => sequelizeConfig(c),
    }),
    HttpModule,
    AuthModule,
    OauthModule,
    RolesModule,
    UsersModule,
    ClientsModule,
    ScopesModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: UserAccessTokenGuard },
    { provide: APP_GUARD, useClass: OAuthAccessTokenGuard },
    { provide: APP_GUARD, useClass: RoleGuard },
    { provide: APP_GUARD, useClass: ScopesGuard },
  ],
})
export class AppModule {}
