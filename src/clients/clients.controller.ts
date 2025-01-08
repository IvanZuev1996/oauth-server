import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ClientsService } from './clients.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateAppDto, DeleteAppDto, GetAppByIdDto, UpdateAppDto } from './dto';
import { GetCurrentUserId } from 'src/common/decorators';

@ApiTags('Clients (apps)')
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'get user applications' })
  @Get()
  getUserApplications(@GetCurrentUserId() userId: number) {
    return this.clientsService.getUserApplications(userId);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'get user application by id' })
  @Get(':id')
  getApplicationById(
    @Param() { clientId }: GetAppByIdDto,
    @GetCurrentUserId() userId: number,
  ) {
    return this.clientsService.getClientByClientId(clientId, userId);
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
  @ApiOperation({ summary: 'delete application' })
  @Delete()
  deleteApplication(
    @Body() dto: DeleteAppDto,
    @GetCurrentUserId() userId: number,
  ) {
    return this.clientsService.delete(dto, userId);
  }
}
