import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { RolesModule } from 'src/roles/roles.module';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserModel } from './models/user.model';

@Module({
  controllers: [UsersController],
  imports: [SequelizeModule.forFeature([UserModel]), RolesModule],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
