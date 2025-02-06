import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ClientModel } from './models/client.model';
import { Repository } from 'sequelize-typescript';
import {
  ChangeAppStatusDto,
  CreateAppDto,
  DeleteAppDto,
  GetAppsDto,
  RevokeTokenDto,
  UpdateAppDto,
} from './dto';
import { nanoid } from 'nanoid';
import { BadRequestException, NotFoundException } from 'src/common/exceptions';
import {
  CLIENT_NOT_AVAILABLE,
  CLIENT_NOT_FOUND,
  TOKEN_NOT_FOUND,
} from 'src/constants';
import { ScopesService } from 'src/scopes/scopes.service';
import { Scope } from 'src/scopes/interfaces';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { ClientStatus } from './interfaces';
import { WhereOptions } from 'sequelize';
import { ClientRefreshTokensModel } from 'src/oauth/models/client-refresh-tokens.model';
import { UserModel } from 'src/users/models/user.model';

@Injectable()
export class ClientsService {
  constructor(
    /* Models */
    @InjectModel(ClientModel)
    private clientsRepository: Repository<ClientModel>,
    @InjectModel(ClientRefreshTokensModel)
    private refreshTokensRepo: Repository<ClientRefreshTokensModel>,

    /* Logger */
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,

    /* Services */
    private readonly scopesService: ScopesService,
  ) {}

  async getUserApplications(dto: GetAppsDto, userId: number) {
    const where: WhereOptions<ClientModel> = { userId };
    if (dto.status) where.status = dto.status;
    return await this.clientsRepository.findAll({
      where,
      attributes: ['clientId', 'name', 'createdAt', 'img', 'status'],
    });
  }

  async getClient(clientId: string, userId?: number) {
    const client = await this.getClientByClientId(clientId, userId);

    const scopesModels = await this.scopesService.getScopesByKeys(
      client.scopes,
      true,
    );

    const scopesDetails: Scope = {};

    for await (const scopeKey of client.scopes) {
      const scopeModel = scopesModels.find((s) => s.key === scopeKey);
      if (!scopeModel) continue;

      const serviceName = scopeModel.service.name;
      const currentScopeData = scopesDetails[serviceName] || {};

      scopesDetails[serviceName] = {
        ...currentScopeData,
        [scopeKey]: {
          title: scopeModel.title,
          ttl: scopeModel.ttl,
          requiresApproval: scopeModel.requiresApproval,
          isTtlRefreshable: scopeModel.isTtlRefreshable,
        },
      };
    }

    if (client.status === ClientStatus.ACTIVE) {
      return { ...client.toJSON(), scopes: scopesDetails };
    }

    return {
      ...client.toJSON(),
      scopes: scopesDetails,
      clientSecret: null,
    };
  }

  async getClientTokensList() {
    return this.refreshTokensRepo.findAndCountAll({
      include: [{ model: ClientModel }, { model: UserModel }],
    });
  }

  async revokeClientToken(dto: RevokeTokenDto) {
    const { clientId, tokenId } = dto;
    const token = await this.refreshTokensRepo.findOne({
      where: { clientId, tokenId },
    });
    if (!token) throw new BadRequestException('token', TOKEN_NOT_FOUND);

    await token.update({
      isRevoked: true,
    });

    return { isRevoked: true };
  }

  async create(dto: CreateAppDto, userId: number) {
    const { name, scopes, img, companyEmail, redirectUri } = dto;

    const clientId = nanoid(32);
    const clientSecret = nanoid(32);

    this.logger.info(`New OAuth client created: ${clientId}`);

    return await this.clientsRepository.create({
      name,
      scopes,
      img,
      companyEmail,
      redirectUri,
      clientId,
      clientSecret,
      userId,
    });
  }

  async update(dto: UpdateAppDto, userId: number) {
    const { name, scopes, img, companyEmail, redirectUri, clientId } = dto;
    const client = await this.getClientByClientId(clientId, userId);

    return await client.update({
      name,
      scopes,
      img,
      companyEmail,
      redirectUri,
    });
  }

  async changeAppStatus(dto: ChangeAppStatusDto) {
    const { clientId } = dto;
    const client = await this.getClientByClientId(clientId);
    if (!client) throw new BadRequestException('client', CLIENT_NOT_FOUND);

    if (dto.status === ClientStatus.ACTIVE) {
      return await client.update({
        status: ClientStatus.ACTIVE,
        scopesOptions: dto.options,
      });
    }

    return await client.update({
      status: ClientStatus.REJECTED,
    });
  }

  async delete(dto: DeleteAppDto, userId: number) {
    const { clientId } = dto;

    const client = await this.getClientByClientId(clientId, userId);
    await client.destroy();

    this.logger.info(`OAuth client deleted: ${clientId}`);

    return { deleted: true };
  }

  /* Internal */
  async getClientByClientId(clientId: string, userId?: number) {
    const client = await this.clientsRepository.findByPk(clientId);
    if (!client) throw new NotFoundException('client', CLIENT_NOT_FOUND);
    if (userId && client.userId !== userId) {
      throw new BadRequestException('client', CLIENT_NOT_AVAILABLE);
    }

    return client;
  }

  async getClientSecretByClientId(clientId: string) {
    const client = await this.clientsRepository.findOne({
      where: { clientId },
      attributes: ['clientSecret'],
    });
    if (!client) throw new NotFoundException('client', CLIENT_NOT_FOUND);

    return client.clientSecret;
  }
}
