import { Body, Controller, Delete, Get, Patch, Post } from '@nestjs/common';
import { ScopesService } from './scopes.service';
import { Public } from 'src/common/decorators';
import { ApiOperation } from '@nestjs/swagger';
import { CreateScopeDto, DeleteScopeDto } from './dto';

@Public()
@Controller('scopes')
export class ScopesController {
  constructor(private readonly scopesService: ScopesService) {}

  @Get()
  @ApiOperation({ summary: 'get all scopes' })
  async getScopes() {
    return this.scopesService.getAllScopes();
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
