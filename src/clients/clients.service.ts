import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ClientModel } from './models/client.model';
import { Repository } from 'sequelize-typescript';
import { CreateAppDto, DeleteAppDto, UpdateAppDto } from './dto';
import { nanoid } from 'nanoid';
import { BadRequestException, NotFoundException } from 'src/common/exceptions';
import { CLIENT_NOT_AVAILABLE, CLIENT_NOT_FOUND } from 'src/constants';
import { ScopesService } from 'src/scopes/scopes.service';
import { Scope } from 'src/scopes/interfaces';

@Injectable()
export class ClientsService {
  constructor(
    @InjectModel(ClientModel)
    private clientsRepository: Repository<ClientModel>,
    private readonly scopesService: ScopesService,
  ) {}

  async getUserApplications(userId: number) {
    return await this.clientsRepository.findAll({
      where: { userId },
      attributes: ['clientId', 'name', 'createdAt', 'img'],
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

    return { ...client.toJSON(), scopes: scopesDetails };
  }

  async create(dto: CreateAppDto, userId: number) {
    const { name, scopes, img, companyEmail, redirectUri } = dto;

    const clientId = nanoid(32);
    const clientSecret = nanoid(32);

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

  async delete(dto: DeleteAppDto, userId: number) {
    const { clientId } = dto;

    const client = await this.getClientByClientId(clientId, userId);
    await client.destroy();

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
