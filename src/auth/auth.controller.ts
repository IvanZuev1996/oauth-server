import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { SignUpDto, SignInDto, RefreshTokenDto } from './dto';
import { AuthService } from './auth.service';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { LogoutResponse, TokensResponse } from 'src/swagger';
import { GetCurrentUserId, Public } from 'src/common/decorators';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @ApiOperation({ summary: 'signup' })
  @ApiOkResponse({ schema: TokensResponse })
  @HttpCode(HttpStatus.OK)
  @Post('signup')
  signUp(@Body() dto: SignUpDto) {
    return this.authService.signUp(dto);
  }

  @Public()
  @ApiOperation({ summary: 'signin' })
  @ApiOkResponse({ schema: TokensResponse })
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  sigIn(@Body() dto: SignInDto) {
    return this.authService.signIn(dto);
  }

  @Public()
  @ApiOperation({ summary: 'refresh token' })
  @ApiCreatedResponse({ schema: TokensResponse })
  @Post('refresh-token')
  refreshToken(@Body() dto: RefreshTokenDto) {
    return this.authService.refreshToken(dto.refresh_token);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'logout from services' })
  @ApiOkResponse({ schema: LogoutResponse })
  @HttpCode(HttpStatus.OK)
  @Post('logout')
  logout(@GetCurrentUserId() user_id: number) {
    return this.authService.logout(user_id);
  }
}
