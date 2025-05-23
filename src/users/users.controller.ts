import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import {
  GetCurrentOauthUserId,
  GetCurrentUserId,
  OAuth,
} from 'src/common/decorators';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'get user info (ALL)' })
  @Get('me')
  getMe(@GetCurrentUserId() userId: number) {
    return this.usersService.getMe(userId);
  }

  @OAuth()
  @ApiOperation({ summary: 'get user info (OAUTH)' })
  @Get('user-info')
  getOAuthUserInfo(@GetCurrentOauthUserId() userId: number) {
    return this.usersService.getMe(userId);
  }
}
