import { Controller, Get, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { RolesEnum } from 'src/configs/roles';
import { UsersService } from './users.service';
const { ADMIN, EMPLOYEE, MANAGER } = RolesEnum;

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'get user info (ALL)' })
  @Get('me')
  getMe() {
    return 'Hello';
  }

  @ApiBearerAuth()
  @Get('test')
  testOauth() {
    return 'OAuth is validated';
  }
}
