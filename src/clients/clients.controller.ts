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
  ChangeAppStatusDto,
  CreateAppDto,
  DeleteAppDto,
  GetAppByIdDto,
  GetAppsDto,
  UpdateAppDto,
} from './dto';
import { GetCurrentUserId, Roles } from 'src/common/decorators';
import { RolesEnum } from 'src/configs/roles';

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
  ) {
    return this.clientsService.getUserApplications(dto, userId);
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
  @Patch()
  changeApplicationStatus(@Body() dto: ChangeAppStatusDto) {
    return this.clientsService.changeAppStatus(dto);
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
