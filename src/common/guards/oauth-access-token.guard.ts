import { ExecutionContext, Injectable } from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { ClientsService } from 'src/clients/clients.service';

@Injectable()
export class OAuthAccessTokenGuard extends AuthGuard('oauth-jwt') {
  constructor(
    private reflector: Reflector,
    readonly clientsService: ClientsService,
  ) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    // TODO:
    // const client = this.clientsService;

    return super.canActivate(context);
  }
}
