import { Controller, All, Req, Res } from '@nestjs/common';
import { ProxyGatewayService } from './proxy-gateway.service';
import { Request, Response } from 'express';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetCurrentClientId, OAuth } from 'src/common/decorators';

@ApiTags('Proxy Gateway')
@Controller('proxy-gateway')
@ApiBearerAuth()
export class ProxyGatewayController {
  constructor(private readonly proxyGatewayService: ProxyGatewayService) {}

  @ApiBearerAuth()
  @OAuth()
  @ApiOperation({ summary: 'proxy for oauth-clients requests' })
  @All('*')
  async handleAllRequests(
    @Req() req: Request,
    @Res() res: Response,
    @GetCurrentClientId() clientId: string,
  ) {
    return this.proxyGatewayService.handleRequest(req, res, clientId);
  }
}
