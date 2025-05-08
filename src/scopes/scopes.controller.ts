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
import { ScopesService } from './scopes.service';
import { Roles } from 'src/common/decorators';
import { ApiOperation } from '@nestjs/swagger';
import {
  ChangeScopeStatusDto,
  CreateScopeDto,
  DeleteScopeDto,
  GetScopeDto,
  GetScopesDto,
  UpdateScopeDto,
} from './dto';
import { RolesEnum } from 'src/configs/roles';

@Controller('scopes')
export class ScopesController {
  constructor(private readonly scopesService: ScopesService) {}

  @Get()
  @ApiOperation({ summary: 'get scopes list' })
  async getScopes(@Query() dto: GetScopesDto) {
    return this.scopesService.getScopesList(dto);
  }

  @Get(':scopeKey')
  @ApiOperation({ summary: 'get scope details' })
  async getScopeDetails(@Param() dto: GetScopeDto) {
    return this.scopesService.getScope(dto.scopeKey);
  }

  @Post()
  @Roles(RolesEnum.ADMIN)
  @ApiOperation({ summary: 'create scope' })
  async createScope(@Body() dto: CreateScopeDto) {
    return this.scopesService.createScope(dto);
  }

  @Patch()
  @Roles(RolesEnum.ADMIN)
  @ApiOperation({ summary: 'update scope' })
  async updateScope(@Body() dto: UpdateScopeDto) {
    return this.scopesService.updateScope(dto);
  }

  @Patch('status')
  @Roles(RolesEnum.ADMIN)
  @ApiOperation({ summary: 'revoke scope' })
  async revokeScope(@Body() dto: ChangeScopeStatusDto) {
    return this.scopesService.changeScopeStatus(dto);
  }

  @Delete()
  @Roles(RolesEnum.ADMIN)
  @ApiOperation({ summary: 'delete scope' })
  async deleteScope(@Body() dto: DeleteScopeDto) {
    return this.scopesService.deleteScope(dto);
  }
}
