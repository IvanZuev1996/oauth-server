import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Repository } from 'sequelize-typescript';
import { ScopeModel } from './models/scope.model';
import { Op } from 'sequelize';

@Injectable()
export class ScopesService {
  constructor(
    @InjectModel(ScopeModel)
    private clientsRepository: Repository<ScopeModel>,
  ) {}

  async getAllScopes() {
    return this.clientsRepository.findAll();
  }

  async createScope() {
    return this.clientsRepository.findAll();
  }

  async getScopesByKeys(scopeKeys: string[]) {
    return this.clientsRepository.findAll({
      where: {
        key: {
          [Op.in]: scopeKeys,
        },
      },
    });
  }
}
