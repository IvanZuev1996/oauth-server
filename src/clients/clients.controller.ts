import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ClientsService } from './clients.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  BanAppDto,
  ChangeAppStatusDto,
  CreateAppDto,
  DeleteAppDto,
  GetAppByIdDto,
  GetAppsDto,
  RevokeTokenDto,
  UpdateAppDto,
} from './dto';
import {
  GetCurrentUserId,
  GetCurrentUserRole,
  Roles,
} from 'src/common/decorators';
import { RolesEnum } from 'src/configs/roles';
import { UserRole } from 'src/users/interfaces';

@ApiTags('Clients (apps)')
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'get user applications' })
  @Get()
  getUserApplications(
    @Query() dto: GetAppsDto,
    @GetCurrentUserId() userId: number,
    @GetCurrentUserRole() role: UserRole,
  ) {
    return this.clientsService.getUserApplications(dto, userId, role.name);
  }

  @ApiBearerAuth()
  @Roles(RolesEnum.ADMIN)
  @ApiOperation({ summary: 'get client refresh tokens list' })
  @Get('tokens')
  async getTokensList() {
    return this.clientsService.getClientTokensList();
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'get user application by id' })
  @Get(':clientId')
  getApplicationById(
    @Param() { clientId }: GetAppByIdDto,
    @GetCurrentUserId() userId: number,
  ) {
    return this.clientsService.getClient(clientId, userId);
  }

  @ApiBearerAuth()
  @Roles(RolesEnum.ADMIN)
  @ApiOperation({ summary: 'revoke client refresh token' })
  @Patch('token/revoke')
  async revokeClientToken(@Body() dto: RevokeTokenDto) {
    return this.clientsService.revokeClientToken(dto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'create application' })
  @Post()
  createApplication(
    @Body() dto: CreateAppDto,
    @GetCurrentUserId() userId: number,
  ) {
    return this.clientsService.create(dto, userId);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'update application' })
  @Patch()
  updateApplication(
    @Body() dto: UpdateAppDto,
    @GetCurrentUserId() userId: number,
  ) {
    return this.clientsService.update(dto, userId);
  }

  @ApiBearerAuth()
  @Roles(RolesEnum.ADMIN)
  @ApiOperation({ summary: 'change application status' })
  @Patch('status')
  changeApplicationStatus(@Body() dto: ChangeAppStatusDto) {
    return this.clientsService.changeAppStatus(dto);
  }

  @ApiBearerAuth()
  @Roles(RolesEnum.ADMIN)
  @ApiOperation({ summary: 'ban or unban application' })
  @Patch('ban')
  banApplication(@Body() dto: BanAppDto) {
    return this.clientsService.banApp(dto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'delete application' })
  @Delete()
  deleteApplication(
    @Body() dto: DeleteAppDto,
    @GetCurrentUserId() userId: number,
  ) {
    return this.clientsService.delete(dto, userId);
  }
}
