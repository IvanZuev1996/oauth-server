import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { OauthService } from './oauth.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthorizeDto, ExchangeAuthCodeDto, RefreshOAuthTokenDto } from './dto';
import {
  GetCurrentClientId,
  GetCurrentUserId,
  OAuth,
  Public,
  Roles,
} from 'src/common/decorators';
import { RolesEnum } from 'src/configs/roles';

@ApiTags('OAuth')
@Controller('oauth')
export class OauthController {
  constructor(private readonly oauthService: OauthService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'authorize user on application after agreement' })
  @Get('authorize')
  async authorize(
    @Query() dto: AuthorizeDto,
    @GetCurrentUserId() userId: number,
  ) {
    return this.oauthService.authorize(dto, userId);
  }

  @Public()
  @ApiOperation({ summary: 'exchange authorization code for access token' })
  @Post('token')
  async exchangeAuthCode(@Body() dto: ExchangeAuthCodeDto) {
    return this.oauthService.exchangeAuthCode(dto);
  }

  @ApiBearerAuth()
  @OAuth()
  @ApiOperation({ summary: 'refresh access token' })
  @Post('token/refresh')
  async refreshAccessToken(
    @Body() dto: RefreshOAuthTokenDto,
    @GetCurrentClientId() clientId: string,
  ) {
    return this.oauthService.refreshOAuthToken(dto, clientId);
  }

  @ApiBearerAuth()
  @Roles(RolesEnum.ADMIN)
  @ApiOperation({ summary: 'revoke access and refresh token' })
  @Post('token/revoke')
  async revokeTokens(@GetCurrentClientId() clientId: string) {
    return this.oauthService.revokeToken(clientId);
  }
}
