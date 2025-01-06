import { Controller, Get, Post } from '@nestjs/common';
import { ScopesService } from './scopes.service';
import { Public } from 'src/common/decorators';
import { ApiOperation } from '@nestjs/swagger';

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
  async createScope() {
    return this.scopesService.getAllScopes();
  }
}
