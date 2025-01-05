import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { GetCurrentUserId } from 'src/common/decorators';

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
}
