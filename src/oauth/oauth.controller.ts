import { Body, Controller, Get, Post, Query, Redirect } from '@nestjs/common';
import { OauthService } from './oauth.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthorizeDto, ExchangeAuthCodeDto } from './dto';
import { GetCurrentUserId } from 'src/common/decorators';

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

  @ApiBearerAuth()
  @ApiOperation({ summary: 'exchange authorization code for access token' })
  @Post('token')
  async exchangeAuthCode(@Body() dto: ExchangeAuthCodeDto) {
    return this.oauthService.exchangeAuthCode(dto);
  }
}
