import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { RolesEnum } from 'src/configs/roles';
import { UsersService } from './users.service';
import { GetCurrentClient, OAuth } from 'src/common/decorators';
import { OAuthTokenPayload } from 'src/oauth/interfaces';

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

  @OAuth()
  @Get('test')
  testOauth(@GetCurrentClient() client: OAuthTokenPayload) {
    return 'OAuth is validated';
  }
}
