import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ClientModel } from './models/client.model';
import { Repository } from 'sequelize-typescript';
import { CreateAppDto, DeleteAppDto, UpdateAppDto } from './dto';
import { nanoid } from 'nanoid';
import { BadRequestException, NotFoundException } from 'src/common/exceptions';
import { CLIENT_NOT_AVAILABLE, CLIENT_NOT_FOUND } from 'src/constants';

@Injectable()
export class ClientsService {
  constructor(
    @InjectModel(ClientModel)
    private clientsRepository: Repository<ClientModel>,
  ) {}

  async getUserApplications(userId: number) {
    return await this.clientsRepository.findAll({ where: { userId } });
  }

  async create(dto: CreateAppDto, userId: number) {
    const { name, scope, img, companyEmail, redirectUri } = dto;

    const clientId = nanoid(32);
    const clientSecret = nanoid(32);

    return await this.clientsRepository.create({
      name,
      scope,
      img,
      companyEmail,
      redirectUri,
      clientId,
      clientSecret,
      userId,
    });
  }

  async update(dto: UpdateAppDto, userId: number) {
    const { name, scope, img, companyEmail, redirectUri, id } = dto;
    const client = await this.getClientById(id, userId);

    return await client.update({
      name,
      scope,
      img,
      companyEmail,
      redirectUri,
    });
  }

  async delete(dto: DeleteAppDto, userId: number) {
    const { id } = dto;

    const client = await this.getClientById(id, userId);
    await client.destroy();

    return { deleted: true };
  }

  /* Internal */

  async getClientById(id: number, userId: number) {
    const client = await this.clientsRepository.findByPk(id);
    if (!client) throw new NotFoundException('client', CLIENT_NOT_FOUND);
    if (client.userId !== userId) {
      throw new BadRequestException('client', CLIENT_NOT_AVAILABLE);
    }

    return client;
  }

  async getClientByClientId(clientId: string) {
    const client = await this.clientsRepository.findOne({
      where: { clientId },
    });
    if (!client) throw new NotFoundException('client', CLIENT_NOT_FOUND);

    return client;
  }
}
