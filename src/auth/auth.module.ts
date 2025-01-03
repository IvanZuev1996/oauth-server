import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { JwtModule } from '@nestjs/jwt';
import { RefreshTokenModel } from './models/tokens.model';
import { AccessTokenStrategy } from './strategies';

@Module({
  controllers: [AuthController],
  providers: [AuthService, AccessTokenStrategy],
  imports: [
    SequelizeModule.forFeature([RefreshTokenModel]),
    UsersModule,
    JwtModule.register({}),
  ],
})
export class AuthModule {}
