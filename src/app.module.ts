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
import { UserAccessTokenGuard, RoleGuard } from './common/guards';
import { OauthModule } from './oauth/oauth.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    HttpModule,
    AuthModule,
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
    RolesModule,
    UsersModule,
    OauthModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: UserAccessTokenGuard },
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
  ],
})
export class AppModule {}
