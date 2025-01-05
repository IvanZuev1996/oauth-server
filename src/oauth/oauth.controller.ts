import { Body, Controller, Get, Post, Query, Redirect } from '@nestjs/common';
import { OauthService } from './oauth.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthorizeDto, ExchangeAuthCodeDto, RefreshOAuthTokenDto } from './dto';
import { GetCurrentUserId, Public } from 'src/common/decorators';

@ApiTags('OAuth')
@Controller('oauth')
export class OauthController {
  constructor(private readonly oauthService: OauthService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'authorize user on application after agreement' })
  @Redirect()
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

  @Public()
  @ApiOperation({ summary: 'refresh access token' })
  @Post('token/refresh')
  async refreshAccessToken(@Body() dto: RefreshOAuthTokenDto) {
    return this.oauthService.refreshOAuthToken(dto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'revoke access and refresh token' })
  @Post('token/revoke')
  async revokeTokens(@Body() dto: ExchangeAuthCodeDto) {
    return this.oauthService.exchangeAuthCode(dto);
  }
}
