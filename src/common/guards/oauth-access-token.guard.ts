import { ExecutionContext, Injectable } from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { OAUTH_METADATA, SCOPES_METADATA } from 'src/constants';

@Injectable()
export class OAuthAccessTokenGuard extends AuthGuard('oauth-jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isOAuthRoute = this.reflector.getAllAndOverride(OAUTH_METADATA, [
      context.getHandler(),
      context.getClass(),
    ]);
    const isHaveRequiredScopes = this.reflector.getAllAndOverride(
      SCOPES_METADATA,
      [context.getHandler(), context.getClass()],
    );

    if (!isOAuthRoute && !isHaveRequiredScopes) return true;

    return super.canActivate(context);
  }
}
