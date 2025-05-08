import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Repository } from 'sequelize-typescript';
import { ScopeModel } from './models/scope.model';
import { Includeable, Op, WhereOptions } from 'sequelize';
import {
  ChangeScopeStatusDto,
  CreateScopeDto,
  DeleteScopeDto,
  GetScopesDto,
  UpdateScopeDto,
} from './dto';
import { ServiceModel } from './models/service.model';
import { BadRequestException } from 'src/common/exceptions';
import { SCOPE_NOT_FOUND, SERVICE_NOT_FOUND } from 'src/constants';
import { MIN_SCOPE_TTL } from 'src/configs/oauth';
import { ClientModel } from 'src/clients/models/client.model';

@Injectable()
export class ScopesService {
  constructor(
    /* Models */
    @InjectModel(ScopeModel)
    private scopesRepository: Repository<ScopeModel>,
    @InjectModel(ServiceModel)
    private servicesRepository: Repository<ServiceModel>,
    @InjectModel(ClientModel)
    private clientsRepository: Repository<ClientModel>,
  ) {}

  async getScope(scopeKey: string) {
    const scope = await this.scopesRepository.findByPk(scopeKey, {
      include: {
        model: ServiceModel,
      },
    });

    if (!scope) throw new BadRequestException('scope', SCOPE_NOT_FOUND);

    const clientsCount = await this.clientsRepository.count({
      where: { scopes: { [Op.contains]: [scopeKey] } },
    });

    return {
      ...scope.toJSON(),
      clientsCount,
    };
  }

  async getScopesList(dto: GetScopesDto) {
    if (!dto.query) {
      return this.scopesRepository.findAndCountAll();
    }

    const where: WhereOptions<ScopeModel> = {
      [Op.or]: [
        {
          key: {
            [Op.iLike]: `%${dto.query}%`,
          },
        },
        {
          title: {
            [Op.iLike]: `%${dto.query}%`,
          },
        },
      ],
    };

    return this.scopesRepository.findAndCountAll({
      where,
    });
  }

  async createScope(dto: CreateScopeDto) {
    const { name, requiresApproval, title, ttl } = dto;
    const scopeTtl = this.getScopeTtl(ttl);
    const key = name.toLowerCase();
    return this.scopesRepository.create({
      serviceId: 1,
      key,
      title,
      ttl: scopeTtl,
      requiresApproval,
    });
  }

  async updateScope(dto: UpdateScopeDto) {
    const { requiresApproval, title, ttl } = dto;
    const scope = await this.getScopeByKey(dto.scopeKey);
    if (!scope) throw new BadRequestException('scope', SCOPE_NOT_FOUND);

    const scopeTtl = this.getScopeTtl(ttl);
    scope.ttl = scopeTtl;
    scope.title = title;
    scope.requiresApproval = requiresApproval;

    return await scope.save();
  }

  async deleteScope(dto: DeleteScopeDto) {
    const { scopeKey } = dto;
    const scope = await this.getScopeByKey(scopeKey);
    if (!scope) throw new BadRequestException('scope', SCOPE_NOT_FOUND);

    await scope.destroy();
    return { deleted: true };
  }

  async changeScopeStatus(dto: ChangeScopeStatusDto) {
    const { scopeKey, status } = dto;
    const scope = await this.getScopeByKey(scopeKey);
    if (!scope) throw new BadRequestException('scope', SCOPE_NOT_FOUND);

    await scope.update({ status });
    return { changed: true };
  }

  async getScopesByKeys(scopeKeys: string[], includeServices?: boolean) {
    const include: Includeable[] = [];
    if (includeServices) include.push({ model: ServiceModel });

    return this.scopesRepository.findAll({
      where: {
        key: {
          [Op.in]: scopeKeys,
        },
      },
      include,
    });
  }

  // #region: INTERNAL *//

  async getScopeByKey(key: string) {
    return this.scopesRepository.findByPk(key);
  }

  private getScopeTtl(ttl: number) {
    return ttl ? Math.max(ttl, MIN_SCOPE_TTL) : MIN_SCOPE_TTL;
  }
}
