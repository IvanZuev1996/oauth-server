import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ScopesService } from './scopes.service';
import { Roles } from 'src/common/decorators';
import { ApiOperation } from '@nestjs/swagger';
import { CreateScopeDto, DeleteScopeDto, GetScopesDto } from './dto';
import { RolesEnum } from 'src/configs/roles';

@Roles(RolesEnum.ADMIN)
@Controller('scopes')
export class ScopesController {
  constructor(private readonly scopesService: ScopesService) {}

  @Get()
  @ApiOperation({ summary: 'get scopes list' })
  async getScopes(@Query() dto: GetScopesDto) {
    return this.scopesService.getScopesList(dto);
  }

  @Post()
  @ApiOperation({ summary: 'create scope' })
  async createScope(@Body() dto: CreateScopeDto) {
    return this.scopesService.createScope(dto);
  }

  @Delete()
  @ApiOperation({ summary: 'delete scope' })
  async deleteScope(@Body() dto: DeleteScopeDto) {
    return this.scopesService.deleteScope(dto);
  }
}
