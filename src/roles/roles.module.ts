import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { RoleModel } from './models/role.model';
import { RolesService } from './roles.service';

@Module({
  imports: [SequelizeModule.forFeature([RoleModel])],
  providers: [RolesService],
  exports: [RolesService],
})
export class RolesModule {}
