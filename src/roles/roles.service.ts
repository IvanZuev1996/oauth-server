import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { Repository } from 'sequelize-typescript';
import { RolesEnum } from 'src/configs/roles';

import { RoleModel } from './models/role.model';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(RoleModel)
    private rolesRepo: Repository<RoleModel>,
  ) {
    this.setupAppRoles();
  }

  private async setupAppRoles() {
    const roleValues = Object.values(RolesEnum);
    for await (const roleName of roleValues) {
      const role = await this.getRoleByName(roleName);
      if (!role) await this.rolesRepo.create({ name: roleName });
    }
  }

  async getRoleByName(name: string) {
    return await this.rolesRepo.findOne({ where: { name }, raw: true });
  }

  async getRoleById(id: number) {
    return await this.rolesRepo.findByPk(id);
  }
}
