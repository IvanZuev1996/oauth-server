import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { RolesEnum } from 'src/configs/roles';
import { UsersService } from './users.service';

const { ADMIN, EMPLOYEE, MANAGER } = RolesEnum;

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'get user info (ALL)' })
  getMe() {
    return 'Hello';
  }
}
