import { Module } from '@nestjs/common';
import { ProxyGatewayService } from './proxy-gateway.service';
import { ProxyGatewayController } from './proxy-gateway.controller';
import { ProxyModule } from 'src/proxy/proxy.module';
import { HttpModule } from '@nestjs/axios';
import { ClientsModule } from 'src/clients/clients.module';

@Module({
  controllers: [ProxyGatewayController],
  providers: [ProxyGatewayService],
  imports: [HttpModule, ProxyModule, ClientsModule],
})
export class ProxyGatewayModule {}
