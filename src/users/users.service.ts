import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { Includeable } from 'sequelize';
import { Repository } from 'sequelize-typescript';
import { RolesEnum } from 'src/configs/roles';
import { ACCESS_DENIED } from 'src/constants';
import { RolesService } from 'src/roles/roles.service';

import { ForbiddenException } from 'src/common/exceptions';
import { UserModel } from './model/user.model';

const { ADMIN, EMPLOYEE, MANAGER } = RolesEnum;

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UserModel)
    private usersRepo: Repository<UserModel>,
    private readonly rolesService: RolesService,
  ) {}

  // #region INTERNAL
  async getUserById(userId: number, include?: Includeable | Includeable[]) {
    return await this.usersRepo.findByPk(userId, { include });
  }
}
