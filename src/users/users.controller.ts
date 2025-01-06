import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { GetCurrentUserId, OAuth, Scopes } from 'src/common/decorators';

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
  @Scopes('service1:scope1')
  @ApiOperation({ summary: 'test' })
  @Get('test')
  test() {
    return 'Да, прошло!';
  }
}
