import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { JwtModule } from '@nestjs/jwt';
import { UserRefreshTokenModel } from './models/tokens.model';
import { AccessTokenStrategy } from './strategies';
import { RolesModule } from 'src/roles/roles.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService, AccessTokenStrategy],
  imports: [
    SequelizeModule.forFeature([UserRefreshTokenModel]),
    UsersModule,
    RolesModule,
    JwtModule.register({}),
  ],
})
export class AuthModule {}
