import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { Includeable } from 'sequelize';
import { Repository } from 'sequelize-typescript';
import { RolesEnum } from 'src/configs/roles';
import { RolesService } from 'src/roles/roles.service';

import { UserModel } from './models/user.model';
import { UserProfile } from './interfaces';
import sequelize from 'sequelize';

const { ADMIN, EMPLOYEE, MANAGER } = RolesEnum;

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UserModel)
    private userRepository: Repository<UserModel>,
    private readonly rolesService: RolesService,
  ) {}

  async getMe(userId: number) {
    return await this.userRepository.findByPk(userId);
  }

  async create(user: Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'>) {
    return await this.userRepository.create(user);
  }

  async getByCredential(
    data: string,
    credential: keyof Omit<
      UserProfile,
      'id' | 'password' | 'is_migrated' | 'referrer_profile_id' | 'role_id'
    >,
  ) {
    return await this.userRepository.findOne({
      where: sequelize.where(
        sequelize.fn('LOWER', sequelize.col(credential)),
        data.toLowerCase(),
      ),
      paranoid: true,
    });
  }

  async getUserByLoginOrTelegram(login_or_tg: string) {
    const byLogin = await this.userRepository.findOne({
      where: sequelize.where(
        sequelize.fn('LOWER', sequelize.col('login')),
        login_or_tg.toLowerCase(),
      ),
      paranoid: true,
    });
    if (byLogin) return byLogin;

    return await this.userRepository.findOne({
      where: sequelize.where(
        sequelize.fn('LOWER', sequelize.col('telegram')),
        login_or_tg.toLowerCase(),
      ),
      paranoid: true,
    });
  }

  // #region INTERNAL
  async getUserById(userId: number, include?: Includeable | Includeable[]) {
    return await this.userRepository.findByPk(userId, { include });
  }
}
